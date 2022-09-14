import { GameEngine, GameRoom, GameRoomDto } from 'interface'
import { useEffect, useState } from 'react'
import { api, getRooms } from './api'

interface Room {
  name: string;
  engine: GameEngine;
}

type Rooms = { [key: string]: Room }

interface RoomsDto {
  rooms: Rooms
}


export function useGetRooms() {
  const [rooms, setRooms] = useState<Rooms | null>();

  useEffect(() => {
    const interval = setInterval(() => {
      api<RoomsDto>(getRooms()).then(res => setRooms(res.rooms));
    }, 5000);
    return () => clearInterval(interval);
  }, [])

  return rooms


}