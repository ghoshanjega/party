import { GameEngine, Events, GameRoomDto, GameEngineDto } from 'interface'
import { NextRouter } from 'next/router'
import { Socket } from 'socket.io-client'
import { StoreState, useStore } from './store'

export const emit = (
  store: StoreState,
  event: string,
  data: { [key: string]: any }
) => {
  store.socket.emit(event, {
    room: store.room,
    ...data,
  })
}

export const setupListners = (
  store: StoreState,
  setState: typeof useStore.setState,
  router: NextRouter
) => {
  store.socket.on(Events.GAME_STATE, (state: GameRoomDto<any>) => {
    setState({ room: state })
  })
  store.socket.on(Events.JOINED_ROOM, (room: GameRoomDto<any>) => {
    setState({ room: room })
    if (room.engine.location !== GameEngine.identifier) {
      router.push(room.engine.location)
    }
  })
}
