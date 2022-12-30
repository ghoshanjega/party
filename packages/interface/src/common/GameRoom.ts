import { Server } from 'socket.io'
import { GameEngine, GameEngineDto } from './GameEngine'
import { Events } from './GameEvents'
import { GamePlayer, GamePlayerDto } from './GamePlayer'

type GameRoomState = 'lobby' | 'start' | 'end'
export interface GameRoomDto<EngineDto extends GameEngineDto<PlayerDto>, PlayerDto extends GamePlayerDto> {
  name: string
  engine: EngineDto
  completed: number
  state: GameRoomState
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
  timeout: NodeJS.Timeout | undefined
  startedAt: number
  ttl: number
  state: GameRoomState

  constructor(engine: GameEngine<Player>, name: string, io: Server, ttl: number) {
    this.startedAt = Date.now()
    this.engine = engine
    this.name = name
    this.io = io
    this.state = 'lobby'
    // initially emit slowly
    this.emitInterval = setInterval(this.emitStateToRoomMates.bind(this), 1000 / 1)
    this.ttl = ttl
  }

  startSession() {
    this.startedAt = Date.now()
    clearInterval(this.emitInterval)
    this.state = 'start'
    this.io.to(this.name).emit(Events.GO_TO_GAME, this.serialize())
    this.engine.startUpdateInterval()
    this.emitInterval = setInterval(this.emitStateToRoomMates.bind(this), 1000 / 6)
    this.timeout = this.killSession(this.ttl)
  }

  emitStateToRoomMates() {
    this.io.to(this.name).emit(Events.GAME_STATE, this.serialize())
  }

  killSession(ttl: number) {
    return setTimeout(() => {
      clearInterval(this.emitInterval)
      this.engine.killEngine()
      this.io.to(this.name).emit(Events.GAME_OVER, this.serialize())
      this.active = false
      this.state = 'end'
    }, ttl)
  }

  serialize(): GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto> {
    return {
      name: this.name,
      engine: this.engine.serialize(),
      completed: getCompletedPercentage(this.startedAt, this.ttl),
      state: this.state,
    }
  }
}

function getCompletedPercentage(createdAt: number, ttl: number): number {
  return Math.ceil(((Date.now() - createdAt) / ttl) * 100)
}
