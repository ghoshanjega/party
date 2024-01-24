import fastify from 'fastify'
import cors from '@fastify/cors'
import socketioServer from 'fastify-socket.io'
import { instrument } from '@socket.io/admin-ui'

import { GameRoom, Agar, Events, GamePlayer, GameRoomsDto, GameEngineDto, GamePlayerDto } from 'interface'
import { Socket } from 'socket.io'
import { generateName } from './utils/player.js'
import { generateRoomName } from './utils/room.js'

const app = fastify({ logger: false })
await app.register(cors, {
  origin: ['http://localhost:3005', 'https://party-games.fly.dev', 'https://party-games.ghoshan.dev'],
})
app.register(socketioServer, {
  cors: {
    origin: ['http://localhost:3005', 'https://party-games.fly.dev', 'https://party-games.ghoshan.dev'],
  },
  transports: ['websocket'], // No Http polling as it is high bandwidth and slow
  logLevel: 'debug',
})

// TODO: Persist these
const gameRooms: Map<String, GameRoom<any>> = new Map()
const gamePlayers: Map<String, GamePlayer> = new Map()

// API
app.get('/ping', async (request, reply) => {
  return 'pong\n'
})

app.get('/rooms', async (request, reply) => {
  const rooms: GameRoomsDto<GameEngineDto<GamePlayerDto>, GamePlayerDto> = {
    rooms: Object.fromEntries(
      new Map(
        Array.from(gameRooms)
          .filter(([key, value]) => value.active)
          // eslint-disable-next-line max-len
          .map(([key, value]) => [key, { name: value.name, engine: value.engine.serialize(true) }])
      )
    ),
  }
  reply.send(rooms)
})

// SOCKET
app.ready((err) => {
  if (err) throw err
  instrument(app.io, {
    auth: false,
    mode: 'development',
  })
  app.io.on('connection', (socket: Socket) => {
    socket.on('*', function (event, data) {
      console.log(event)
      console.log(data)
    })
    socket.on(Events.CREATE_AND_JOIN_ROOM, (data: { gameId: string }) => {
      let uniqueRoomName = generateRoomName()
      while (gameRooms.get(uniqueRoomName)) {
        uniqueRoomName = generateRoomName()
      }
      // Create a game room and engine
      if (data.gameId === Agar.Engine.identifier) {
        const engine = new Agar.Engine()
        const gameRoom = new GameRoom(engine, uniqueRoomName, app.io, 60000)
        gameRooms.set(uniqueRoomName, gameRoom)
      }

      // Create and join the player
      const room = gameRooms.get(uniqueRoomName)
      if (room) {
        if (!room.engine.hasPlayer(socket)) {
          const { x, y } = Agar.randomPosInMap()
          const player = new Agar.Player(generateName(), socket, x, y)
          player.isLeaderAndReady()
          room.engine.addPlayer(socket, player)
          gamePlayers.set(socket.id, player)
        }
        socket.join(room.name)
        room.emitStateToRoomMates()
      }
    })

    socket.on(Events.JOIN_ROOM, (data: { roomId: string }) => {
      const room = gameRooms.get(data.roomId)
      if (room) {
        // Create a new player
        if (!room.engine.hasPlayer(socket)) {
          const { x, y } = Agar.randomPosInMap()
          const player = new Agar.Player(generateName(), socket, x, y)
          room.engine.addPlayer(socket, player)
          gamePlayers.set(socket.id, player)
        }
        socket.join(room.name)
        room.emitStateToRoomMates()
      }
    })
    socket.on(Events.INPUT, (data) => {
      const room = gameRooms.get(data.room.name)
      if (room) {
        room.engine.handleInput(socket, data)
      }
    })
    socket.on(Events.READY, (data) => {
      const room = gameRooms.get(data.room.name)
      if (room) {
        room.engine.readyPlayer(socket)
      }
    })
    socket.on(Events.START, (data) => {
      const room = gameRooms.get(data.room.name)
      if (room) {
        room.startSession()
      }
    })
    socket.on(Events.LEAVE_ROOM, (data) => {
      const room = gameRooms.get(data.room.name)
      if (room) {
        socket.leave(room.name)
        // socket.disconnect()
        room.engine.removePlayer(socket.id)
        if (room.engine.players.size === 0) {
          gameRooms.delete(room.name)
        }
      }
    })
  })
})

app.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`app listening at ${address}`)
})
