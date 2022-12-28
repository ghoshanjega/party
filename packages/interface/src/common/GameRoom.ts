import { Server } from 'socket.io'
import { GameEngine, GameEngineDto } from './GameEngine'
import { Events } from './GameEvents'
import { GamePlayer, GamePlayerDto } from './GamePlayer'

export interface GameRoomDto<EngineDto extends GameEngineDto<PlayerDto>, PlayerDto extends GamePlayerDto> {
  name: string
  engine: EngineDto
  completed: number
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
  timeout: NodeJS.Timeout
  createdAt: number
  ttl: number

  constructor(engine: GameEngine<Player>, name: string, io: Server, ttl: number) {
    this.createdAt = Date.now()
    this.engine = engine
    this.name = name
    this.io = io
    this.emitInterval = setInterval(this.emitState.bind(this), 1000 / 6) // TODO: updates per second
    ;(this.timeout = this.killSession(ttl)), (this.ttl = ttl)
  }

  emitState() {
    this.io.to(this.name).emit(Events.GAME_STATE, this.serialize())
  }

  killSession(ttl: number) {
    return setTimeout(() => {
      clearInterval(this.emitInterval)
      this.engine.clearUpdateInterval()
      this.io.to(this.name).emit(Events.GAME_OVER, this.serialize())
      this.active = false
    }, ttl)
  }

  serialize(): GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto> {
    return {
      name: this.name,
      engine: this.engine.serialize(),
      completed: getCompletedPercentage(this.createdAt, this.ttl),
    }
  }
}

function getCompletedPercentage(createdAt: number, ttl: number): number {
  return Math.ceil(((Date.now() - createdAt) / ttl) * 100)
}
