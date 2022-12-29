import fastify from 'fastify'
import cors from '@fastify/cors'
import socketioServer from 'fastify-socket.io'

import { GameRoom, Agar, Events, GamePlayer, GameRoomsDto, GameEngineDto, GamePlayerDto } from 'interface'
import { Socket } from 'socket.io'
import { generateName } from './utils/player.js'

const app = fastify({ logger: false })
await app.register(cors, {
  origin: '*',
})
app.register(socketioServer, {
  cors: {
    origin: '*',
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
          .map(([key, value]) => [key, { name: value.name, engine: value.engine.serialize() }])
      )
    ),
  }
  reply.send(rooms)
})

// SOCKET
app.ready((err) => {
  if (err) throw err
  app.io.on('connection', (socket: Socket) => {
    socket.on(Events.JOIN_ROOM, (data: { roomId: string }) => {
      const gameRoom = gameRooms.get(data.roomId)
      // Create a game room and engine
      if (!gameRoom) {
        const engine = new Agar.Engine()
        const gameRoom = new GameRoom(engine, data.roomId, app.io, 60000)
        gameRooms.set(gameRoom.name, gameRoom)
      }
      const room = gameRooms.get(data.roomId)
      if (room) {
        // Create a new player
        if (!room.engine.hasPlayer(socket)) {
          const { x, y } = Agar.randomPosInMap()
          const player = new Agar.Player(generateName(), socket, x, y)
          room.engine.addPlayer(socket, player)
          gamePlayers.set(socket.id, player)
        }
        socket.join(data.roomId)
        socket.emit(Events.JOINED_ROOM, room.serialize())
      }
    })
    socket.on(Events.INPUT, (data) => {
      const room = gameRooms.get(data.room.name)
      if (room) {
        room.engine.handleInput(socket, data)
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
