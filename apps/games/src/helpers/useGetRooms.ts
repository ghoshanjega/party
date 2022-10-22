import {
  GameEngine,
  GameEngineDto,
  GamePlayerDto,
  GameRoomDto,
  GameRoomsDto,
} from 'interface'
import { useEffect, useState } from 'react'
import { api, getRooms } from './api'

export function useGetRooms() {
  const [rooms, setRooms] = useState<{
    [key: string]: GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto>
  } | null>()

  useEffect(() => {
    const interval = setInterval(() => {
      api<GameRoomsDto<GameEngineDto<GamePlayerDto>, GamePlayerDto>>(
        getRooms()
      ).then((res) => setRooms(res.rooms))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return rooms
}
