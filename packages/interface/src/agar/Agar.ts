import { C } from './Constants';
import { Obj } from './Obj'

export type Agars = Map<string, Agar>

export class Agar extends Obj {
  constructor(id: string, x: number, y: number, dir: number, speed: number, size: number) {
    super(id, x, y, dir, speed, size, '#ff1234');
  }

  update(dt: number) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  distanceTo(object: Obj) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}