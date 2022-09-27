import { Server } from 'socket.io'
import { GameEngine, GameEngineDto } from './GameEngine'
import { Events } from './GameEvents'
import { GamePlayer, GamePlayerDto } from './GamePlayer'

export interface GameRoomDto<Player extends GamePlayer> {
  name: string
  engine: Player
}

export type Rooms<Player extends GamePlayer> = { [key: string]: GameRoomDto<Player> }

export interface RoomsDto<Player extends GamePlayer> {
  rooms: Rooms<Player>
}

export class GameRoom<Player extends GamePlayer> {
  name: string
  engine: GameEngine<Player>
  io: Server
  constructor(engine: GameEngine<Player>, name: string, io: Server) {
    this.engine = engine
    this.name = name
    this.io = io
    setInterval(this.emitState.bind(this), 1000 / 30)
  }

  emitState() {
    this.io.to(this.name).emit(Events.GAME_STATE, this.serialize())
  }
  // this.engine.serialize()

  serialize(): GameRoomDto<Player> {
    return {
      name: this.name,
      engine: this.engine.serialize(),
    }
  }
}
