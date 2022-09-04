import { C, Game } from "interface";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { useStore } from "./store";


export const play = (socket: any, username: string) => {
  socket.emit(C.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = (socket: any, dir: number) => {
  socket.emit(C.MSG_TYPES.INPUT, dir);
};

export const joinGame = (socket: any, username: string = "default") => {
  console.log("emitting join game")
  socket.emit(C.MSG_TYPES.JOIN_GAME, username)
}

export const setupListners = (socket: Socket, setState: typeof useStore.setState) => {
  socket.on(C.MSG_TYPES.GAME_STATE, (state: Game) => {
    if (setState) {
      setState({ game: state })
    }
  })
  socket.on(C.MSG_TYPES.JOINED_GAME, () => {
    if (setState) {
      setState({ joined: true })
    }
  })
}

export const emitControl = (socket: Socket, direction: number, speed: number) => {
  socket.emit(C.MSG_TYPES.INPUT, direction, speed)
}
