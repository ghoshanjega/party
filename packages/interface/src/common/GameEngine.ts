import { Socket } from 'socket.io'
import { GamePlayer, GamePlayers } from './GamePlayer'

export interface GameEngineDto<Player> {
  location: string
  players: { [key: string]: Player }
}

export abstract class GameEngine<Player extends GamePlayer> {
  static identifier = 'lobby'
  location: string
  players: GamePlayers<Player>
  constructor() {
    this.players = new Map()
    this.location = GameEngine.identifier
  }

  removePlayer(socket: Socket) {
    this.players.delete(socket.id)
  }

  abstract handleInput(socket: Socket, data: any): void

  abstract serialize(): any
}
