import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { GameEngine, GameEngineDto, GamePlayer } from '../common'

import { Agar, AgarDto, Agars } from './Agar'
import { C } from './Constants'
import { Player, PlayerDto } from './Player'
import { randomPosInMap, randomSize } from './utils'

export interface EngineDto extends GameEngineDto<PlayerDto> {
  agars: { [key: string]: AgarDto }
  lastUpdateTime: number
}

export class Engine extends GameEngine<Player> {
  static identifier = 'agar'
  agars: Agars
  lastUpdateTime: number
  shouldSendUpdate: boolean

  constructor() {
    super()
    this.location = Engine.identifier
    this.agars = new Map()
    this.lastUpdateTime = Date.now()
    this.shouldSendUpdate = false
    setInterval(this.update.bind(this), 1000 / 30)
    this.initialize()
  }

  initialize() {
    const agarMap: Agars = new Map()
    for (let index = 0; index < C.AGAR_START_COUNT; index++) {
      const id = uuidv4()
      const { x, y } = randomPosInMap()
      const size = randomSize(C.AGAR_MIN_SIZE, C.AGAR_MAX_SIZE)
      agarMap.set(id, new Agar(id, x, y, 0, 0, size))
    }
    this.agars = agarMap
  }

  update() {
    const now = Date.now()
    const dt = (now - this.lastUpdateTime) / 1000
    this.lastUpdateTime = now
    for (const [playerId, player] of this.players) {
      if (player) {
        player.update(dt)
      }
    }
    for (const [agarId, agar] of this.agars) {
      for (const [playerId, player] of this.players) {
        if (agar && player.body.isWithinRadius(agar.x, agar.y)) {
          // delete this agar
          player.body.size += agar.size
          this.agars.delete(agarId)
          // create a replacement
          const id = uuidv4()
          const { x, y } = randomPosInMap()
          const size = randomSize(C.AGAR_MIN_SIZE, C.AGAR_MAX_SIZE)
          this.agars.set(id, new Agar(id, x, y, 0, 0, size))
        }
      }
    }
  }

  handleInput(socket: Socket, data: { dir: number; speed: number }) {
    const player = this.players.get(socket.id) as Player
    if (player) {
      player.body.setDirection(data.dir)
      player.body.setSpeed(data.speed)
    }
  }

  serialize(): EngineDto {
    return {
      players: Object.fromEntries(new Map(Array.from(this.players).map(([key, value]) => [key, value.serialize()]))),
      agars: Object.fromEntries(this.agars),
      lastUpdateTime: this.lastUpdateTime,
      location: this.location,
    }
  }
}
