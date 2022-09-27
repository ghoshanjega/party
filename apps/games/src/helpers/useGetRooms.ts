import { GameEngine, Rooms, RoomsDto } from 'interface'
import { useEffect, useState } from 'react'
import { api, getRooms } from './api'

export function useGetRooms() {
  const [rooms, setRooms] = useState<Rooms<any> | null>()

  useEffect(() => {
    const interval = setInterval(() => {
      api<RoomsDto<any>>(getRooms()).then((res) => setRooms(res.rooms))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return rooms
}
