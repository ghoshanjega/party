import { GameEngine } from "./Engine";


export interface GameRoomDto {
  room: string;
  players: any;
}

export class GameRoom {
  name: string;
  engine: GameEngine;
  constructor(engine: GameEngine) {
    this.engine = engine
    this.name = "random" + Math.random()
  }
}

