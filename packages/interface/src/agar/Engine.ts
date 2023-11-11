import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { v4 as uuidv4 } from 'uuid'
import { GameEngine, GameEngineDto, GamePlayer } from '../common'

import { Agar, AgarDto, Agars } from './Agar'
import { C } from './Constants'
import { Player, PlayerDto } from './Player'
import { randomPosInMap, randomSize } from './utils'

export interface EngineDto extends GameEngineDto<PlayerDto> {
  agars?: { [key: string]: AgarDto }
  lastUpdateTime: number
}

export class Engine extends GameEngine<Player> {
  static label = 'Space balls'
  static identifier = 'agar'
  agars: Agars
  lastUpdateTime: number
  NUM_AGARS = this.players.size * C.AGAR_COUNT_PER_PLAYER

  constructor() {
    super()
    this.location = Engine.identifier
    this.agars = new Map()
    this.lastUpdateTime = Date.now()
    this.initialize()
  }

  initialize() {
    const agarMap: Agars = new Map()
    this.agars = agarMap
  }

  replenishAgar() {
    for (let index = this.agars.size; index < this.NUM_AGARS; index++) {
      const id = uuidv4()
      const { x, y } = randomPosInMap()
      const size = randomSize(C.AGAR_MIN_SIZE, C.AGAR_MAX_SIZE)
      this.agars.set(id, new Agar(id, x, y, 0, 0, size))
    }
  }

  update() {
    if (this.active) {
      const now = Date.now()
      const dt = (now - this.lastUpdateTime) / 1000
      this.lastUpdateTime = now
      this.NUM_AGARS = this.players.size * C.AGAR_COUNT_PER_PLAYER

      for (const [agarId, agar] of this.agars) {
        for (const [playerId, player] of this.players) {
          if (agar && player.body.isWithinRadius(agar.x, agar.y)) {
            // delete this agar
            player.score += agar.size
            this.agars.delete(agarId)
            // create a replacement
            const id = uuidv4()
            const { x, y } = randomPosInMap()
            const size = randomSize(C.AGAR_MIN_SIZE, C.AGAR_MAX_SIZE)
            this.agars.set(id, new Agar(id, x, y, 0, 0, size))
          }
        }
      }
      for (const [player1Id, player1] of this.players) {
        for (const [player2Id, player2] of this.players) {
          if (player1Id !== player2Id) {
            if (player1.body.isOverlapping(player2.body)) {
              // Eat the smaller player
              if (player1.body.size > player2.body.size) {
                player1.body.size += player2.body.size
                this.removePlayer(player2Id)
              } else if (player1.body.size < player2.body.size) {
                player2.body.size += player1.body.size
                this.removePlayer(player1Id)
              }
            }
          }
        }
      }
      for (const [playerId, player] of this.players) {
        if (player) {
          player.update(dt)
        }
      }
      this.replenishAgar()
      setTimeout(() => {
        this.update()
      }, 10)
    }
  }

  handleInput(socket: Socket, data: { dir: number; speed: number }) {
    const player = this.players.get(socket.id) as Player
    if (player) {
      player.body.setDirection(data.dir)
      player.body.setSpeed(data.speed)
    }
  }

  serialize(partial: Boolean): EngineDto {
    return {
      players: Object.fromEntries(new Map(Array.from(this.players).map(([key, value]) => [key, value.serialize()]))),
      agars: partial ? {} : Object.fromEntries(this.agars),
      lastUpdateTime: this.lastUpdateTime,
      location: this.location,
      identifier: Engine.identifier,
      label: Engine.label,
    }
  }
}
