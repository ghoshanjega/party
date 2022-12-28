import { Server } from 'socket.io'
import { GameEngine, GameEngineDto } from './GameEngine'
import { Events } from './GameEvents'
import { GamePlayer, GamePlayerDto } from './GamePlayer'

export interface GameRoomDto<EngineDto extends GameEngineDto<PlayerDto>, PlayerDto extends GamePlayerDto> {
  name: string
  engine: EngineDto
}

export interface GameRoomsDto<EngineDto extends GameEngineDto<PlayerDto>, PlayerDto extends GamePlayerDto> {
  rooms: { [key: string]: GameRoomDto<EngineDto, PlayerDto> }
}

export class GameRoom<Player extends GamePlayer> {
  name: string
  engine: GameEngine<Player>
  io: Server
  active: boolean = true
  emitInterval: NodeJS.Timer
  constructor(engine: GameEngine<Player>, name: string, io: Server) {
    this.engine = engine
    this.name = name
    this.io = io
    this.emitInterval = setInterval(this.emitState.bind(this), 1000 / 6) // TODO: updates per second
    this.killSession()
  }

  emitState() {
    this.io.to(this.name).emit(Events.GAME_STATE, this.serialize())
  }

  killSession() {
    setTimeout(() => {
      clearInterval(this.emitInterval)
      this.engine.clearUpdateInterval()
      this.io.to(this.name).emit(Events.GAME_OVER, this.serialize())
      this.active = false
    }, 60000 * 1)
  }

  serialize(): GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto> {
    return {
      name: this.name,
      engine: this.engine.serialize(),
    }
  }
}
