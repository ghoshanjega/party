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
  constructor(engine: GameEngine<Player>, name: string, io: Server) {
    this.engine = engine
    this.name = name
    this.io = io
    setInterval(this.emitState.bind(this), 1000 / 6) // TODO: updates per second
  }

  emitState() {
    this.io.to(this.name).emit(Events.GAME_STATE, this.serialize())
  }

  serialize(): GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto> {
    return {
      name: this.name,
      engine: this.engine.serialize(),
    }
  }
}
