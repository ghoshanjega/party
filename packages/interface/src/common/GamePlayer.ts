import { Socket } from 'socket.io'

export type GamePlayers<T extends GamePlayer> = Map<string, T>

export interface GamePlayerDto {
  id: string
  username: string
  ready: boolean
  isLeader: boolean
}

// Original Player / User agnostic of any game information
export abstract class GamePlayer {
  id: string
  username: string
  socket: Socket
  ready: boolean = false
  isLeader: boolean = false
  constructor(socket: Socket, id: string, username: string) {
    ;[this.id, this.socket, this.username] = [id, socket, username]
  }

  abstract isLeaderAndReady(): void
  abstract serialize(): GamePlayerDto
}
