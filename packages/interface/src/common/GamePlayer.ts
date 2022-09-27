import { Socket } from 'socket.io'

export type GamePlayers<T extends GamePlayer> = Map<string, T>

export interface GamePlayerDto {
  id: string
  username: string
}

// Original Player / User agnostic of any game information
export abstract class GamePlayer {
  id: string
  username: string
  socket: Socket

  constructor(socket: Socket, id: string, username: string) {
    ;[this.id, this.socket, this.username] = [id, socket, username]
  }

  abstract serialize(): GamePlayerDto
}
