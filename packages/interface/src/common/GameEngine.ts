import { Socket } from 'socket.io'
import { GamePlayer, GamePlayers } from './GamePlayer'

export interface GameEngineDto<PlayerDto> {
  location: string
  players: { [key: string]: PlayerDto }
  label: string
  identifier: string
}

export abstract class GameEngine<Player extends GamePlayer> {
  static label = 'lobby'
  static identifier = 'lobby'
  location: string
  players: GamePlayers<Player>
  updateInterval: NodeJS.Timer | undefined
  active: boolean = true
  constructor() {
    this.players = new Map()
    this.location = GameEngine.identifier
  }

  abstract update(): void

  abstract handleInput(socket: Socket, data: any): void

  abstract serialize(): any

  killEngine() {
    this.active = false
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

  readyPlayer(socket: Socket) {
    const player = this.players.get(socket.id) as Player
    if (player) {
      player.ready = true
    }
  }

  startUpdateInterval() {
    this.update()
  }
}
