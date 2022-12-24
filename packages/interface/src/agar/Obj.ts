import { C } from './Constants'

export interface ObjDto {
  id: string
  x: number
  y: number
  direction: number
  speed: number
  size: number
  color: string
}

export class Obj {
  id: string
  x: number
  y: number
  direction: number
  speed: number
  size: number
  color: string
  constructor(id: string, x: number, y: number, dir: number, speed: number, size: number, color: string) {
    this.id = id
    this.x = x
    this.y = y
    this.direction = dir
    this.speed = speed
    this.size = size
    this.color = color
  }

  update(dt: number) {
    this.x += dt * this.speed * Math.sin(this.direction)
    this.y += dt * this.speed * Math.cos(this.direction)
  }

  distanceTo(object: Obj) {
    const dx = this.x - object.x
    const dy = this.y - object.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  setDirection(dir: number) {
    this.direction = dir
  }

  setSpeed(speed: number) {
    if (speed < C.PLAYER_MAX_SPEED && speed > C.PLAYER_MIN_SPEED) {
      this.speed = speed
    } else if (speed > C.PLAYER_MAX_SPEED) {
      this.speed = C.PLAYER_MAX_SPEED
    } else {
      this.speed = C.PLAYER_MIN_SPEED
    }
  }

  isWithinRadius(x: number, y: number) {
    return this.x - this.size < x && x < this.x + this.size && this.y - this.size < y && y < this.y + this.size
  }

  isOverlapping(enemy: Obj) {
    const [x1, y1, size1] = [enemy.x, enemy.y, enemy.size]
    return Math.hypot(this.x - x1, this.y - y1) <= this.size + size1
  }

  serialize(): ObjDto {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      color: this.color,
      direction: this.direction,
      size: this.size,
      speed: this.speed,
    }
  }
}
