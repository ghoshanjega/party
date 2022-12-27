import { Socket } from 'socket.io'
import { GamePlayer, GamePlayerDto } from '../common'
import { C } from './Constants'
import { Obj, ObjDto } from './Obj'
import { randomColor } from './utils'

export interface PlayerDto extends GamePlayerDto {
  score: number
  body: ObjDto
  createdAt: number
}

export class Player extends GamePlayer {
  score: number
  body: Obj
  createdAt: number
  constructor(username: string, socket: Socket, x: number, y: number) {
    super(socket, socket.id, username)
    this.score = 0
    this.createdAt = Date.now()
    this.body = new Obj(socket.id, x, y, Math.random() * 2 * Math.PI, C.PLAYER_MIN_SPEED, C.PLAYER_START_SIZE, randomColor())
  }

  update(dt: number) {
    this.body.update(dt)

    // Update score
    this.score = ((Date.now() - this.createdAt) / 1000) * C.SCORE_PER_SECOND + this.body.size

    // Make sure the player stays in bounds
    this.body.x = Math.max(-C.MAP_SIZE / 2, Math.min(C.MAP_SIZE / 2, this.body.x))
    this.body.y = Math.max(-C.MAP_SIZE / 2, Math.min(C.MAP_SIZE / 2, this.body.y))

    // Make sure the player stays in size bound
    this.body.size = Math.max(C.PLAYER_START_SIZE, Math.min(C.PLAYER_MAX_SIZE, this.body.size))
  }

  serialize(): PlayerDto {
    return {
      body: this.body.serialize(),
      createdAt: this.createdAt,
      id: this.id,
      score: this.score,
      username: this.username,
    }
  }
}
