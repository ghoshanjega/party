import fastify from 'fastify'
import cors from '@fastify/cors'
import socketioServer from 'fastify-socket.io'
import { GameRoomDto, GameRoom, C, AgarEngine } from 'interface'
import { Socket } from 'socket.io'

const app = fastify({ logger: true })
await app.register(cors, {
  origin: "*"
})
app.register(socketioServer, {
  cors: {
    origin: "*"
  }
})

const gameRooms: Map<String, GameRoom> = new Map();


app.get('/ping', async (request, reply) => {
  return 'pong\n'
})

app.get('/rooms', async (request, reply) => {
  reply.send({
    "rooms": Object.fromEntries(gameRooms)
  })
})



app.ready(err => {
  if (err) throw err

  app.io.on('connection', (socket: Socket) => {
    socket.on(C.MSG_TYPES.JOIN_ROOM, (roomId: string) => {
      if (gameRooms.has(roomId)) {
        socket.join(roomId)
      }
      else {
        // TODO: Multiple game engines
        const engine = new AgarEngine();
        const gameRoom = new GameRoom(engine)
        gameRooms.set(roomId, gameRoom);
        socket.join(roomId);
      }
    })
    socket.on("*", (event, data) => {
      console.log("scoket.rooms", socket.rooms)
    })
  })
})

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`app listening at ${address}`)
})