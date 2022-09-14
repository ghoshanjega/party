import { v4 as uuidv4 } from 'uuid';
import { GameEngine, GamePlayer } from '../common';

import { Agar, Agars } from "./Agar";
import { C } from "./Constants";
import { Player, Players } from "./Player";
import { Socket, Sockets } from "./Socket";
import { randomPosInMap, randomSize } from './utils';

export const famr = 1

export class AgarEngine extends GameEngine {
  sockets: Sockets;
  players: Players;
  agars: Agars;
  lastUpdateTime: number;
  shouldSendUpdate: boolean;

  constructor() {
    super()
    this.sockets = {};
    this.players = {};
    this.agars = new Map();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
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
    this.agars = agarMap;
  }

  update() {
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;
    for (const playerId in this.players) {
      const player = this.players[playerId]
      this.players[playerId].update(dt, player.body.direction)
    }
    for (const [agarId, agar] of this.agars) {
      for (const playerId in this.players) {
        const player = this.players[playerId]

        if (agar && player.body.isWithinRadius(agar.x, agar.y)) {
          // delete this agar
          player.body.size += agar.size
          this.agars.delete(agarId)
          // create a replacement
          const id = uuidv4()
          const { x, y } = randomPosInMap()
          const size = randomSize(C.AGAR_MIN_SIZE, C.AGAR_MAX_SIZE)
          this.agars.set(id, new Agar(id, x, y, 0, 0, size))


          console.log("agar count", Object.keys(this.agars).length)
        }
      }
    }
    // io.emit(C.MSG_TYPES.GAME_STATE, this.serialize())gfhedfgdhbjfyfjgyhjhfjghf
  }

  addPlayer(socket: Socket, player: GamePlayer) {
    // console.log("soso", socket, username)
    this.sockets[socket.id] = socket;


    // Generate a position to start this player at.
    const x = C.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = C.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(player, socket.id, x, y);
  }

  removePlayer(socket: Socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket: Socket, dir: number, speed: number) {
    if (this.players[socket.id]) {
      this.players[socket.id].body.setDirection(dir);
      this.players[socket.id].body.setSpeed(speed);
    }
  }



  serialize() {
    return {
      sockets: {},
      players: this.players,
      agars: Object.fromEntries(this.agars),
      lastUpdateTime: this.lastUpdateTime
    }
  }

  // ...
}