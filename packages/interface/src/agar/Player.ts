import { GamePlayer } from "../common";
import { C } from "./Constants";
import { Obj } from "./Obj";
import { randomColor } from "./utils";

export interface Players {
  [key: string]: Player
}

export class Player extends GamePlayer {
  score: number;
  body: Obj;
  createdAt: number;
  constructor(player: GamePlayer, id: string, x: number, y: number) {
    super(player);
    this.score = 0;
    this.createdAt = Date.now()
    this.body = new Obj(id, x, y, Math.random() * 2 * Math.PI, C.PLAYER_MIN_SPEED, C.PLAYER_START_SIZE, randomColor)
  }

  update(dt: number, direction: number) {
    this.body.update(dt, direction);

    // Update score
    this.score = (Date.now() - this.createdAt) / 1000 * C.SCORE_PER_SECOND + this.body.size

    // Make sure the player stays in bounds
    this.body.x = Math.max(0, Math.min(C.MAP_SIZE, this.body.x));
    this.body.y = Math.max(0, Math.min(C.MAP_SIZE, this.body.y));

  }
}