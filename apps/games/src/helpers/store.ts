import { NextRouter } from 'next/router'
import { MutableRefObject } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import io from 'socket.io-client'
import { GameEngineDto, GamePlayerDto, GameRoomDto } from 'interface'
import { URI } from './api'

// const socket = io(`ws://localhost:3001`, {
//   path: "/socket.io"
// });

const socket = io(URI.replace('http', 'ws'), {
  transports: ['websocket'],
})

export interface StoreState {
  router: NextRouter
  dom: MutableRefObject<any>
  socket: typeof socket
  room: GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto>
  joined: boolean
}

// const useStoreImpl = create<StoreState>(() => {
//   return {
//     router: null,
//     dom: null,
//   }
// })

// const useStore = (set) => useStoreImpl(set, shallow)
// Object.assign(useStore, useStoreImpl)

// const { getState, setState } = useStoreImpl

// export { getState, setState }
// export default useStore

export const useStore = create<StoreState>((set, shallow) => ({
  // @ts-ignore
  dom: null,
  // @ts-ignore
  router: null,
  socket: socket,
  // player: {
  //   username: "farmer",
  //   score: 0
  // },
  // @ts-ignore
  room: null,
  joined: false,
}))
