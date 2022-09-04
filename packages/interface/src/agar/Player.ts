import { C } from "./Constants";
import { Obj } from "./Obj";
import { randomColor } from "./utils";

export interface Players {
  [key: string]: Player
}

export class Player extends Obj {
  username: string;
  score: number;
  createdAt: number;
  constructor(id: string, username: string, x: number, y: number) {
    super(id, x, y, Math.random() * 2 * Math.PI, C.PLAYER_MIN_SPEED, C.PLAYER_START_SIZE, randomColor);
    this.username = username;
    this.score = 0;
    this.createdAt = Date.now()
  }

  update(dt: number, direction: number) {
    super.update(dt, direction);

    // Update score
    this.score = (Date.now() - this.createdAt) / 1000 * C.SCORE_PER_SECOND + this.size

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(C.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(C.MAP_SIZE, this.y));

  }
}