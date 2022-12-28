import { Socket } from 'socket.io'
import { GamePlayer, GamePlayers } from './GamePlayer'

export interface GameEngineDto<PlayerDto> {
  location: string
  players: { [key: string]: PlayerDto }
}

export abstract class GameEngine<Player extends GamePlayer> {
  static identifier = 'lobby'
  location: string
  players: GamePlayers<Player>
  constructor() {
    this.players = new Map()
    this.location = GameEngine.identifier
  }

  addPlayer(socket: Socket, player: Player) {
    this.players.set(socket.id, player)
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId)
  }

  hasPlayer(socket: Socket) {
    return this.players.has(socket.id)
  }

  abstract handleInput(socket: Socket, data: any): void

  abstract serialize(): any
}
