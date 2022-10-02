import { TopBar } from '@/components/layout/TopBar'
import { emit } from '@/helpers/socket'
import { useStore } from '@/helpers/store'
import { useGetRooms } from '@/helpers/useGetRooms'
import { Events, GameRoomDto } from 'interface'
import React, { useState } from 'react'

const Navbar = () => {
  const { socket } = useStore()
  return (
    <div className='row w-100'>
      <div className='col'>Party games</div>
      <div className='col'>Hello</div>
    </div>
  )
}

const RoomSelector = () => {
  const store = useStore()
  const rooms = useGetRooms()
  const handleJoin = (room: GameRoomDto<any>) => {
    emit(store, Events.JOIN_ROOM, { roomId: room.name })
  }
  if (rooms) {
    return (
      <div className='w-100'>
        {Object.entries(rooms).map(([key, room]) => (
          <div key={key} className='w-100 p-3 d-flex justify-content-between'>
            <div>{room.name}</div>
            <div>
              <button
                className='btn btn-success'
                onClick={() => handleJoin(room)}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }
  return <></>
}

const CreateRoom = () => {
  const [name, setName] = useState('')
  const store = useStore()

  const handleCreate = () => {
    emit(store, Events.JOIN_ROOM, { roomId: name })
  }

  return (
    <div className='p-5'>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Room name
        </label>
        <input
          type='text'
          className='form-control'
          id='name'
          aria-describedby='Room name'
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button
        onClick={handleCreate}
        disabled={name === ''}
        className='btn btn-primary'
      >
        Create room
      </button>
    </div>
  )
}

const GameLibrary = () => {
  return <></>
}

function Index() {
  return (
    <React.Fragment>
      <TopBar>
        <Navbar />
      </TopBar>
      <GameLibrary />
      <RoomSelector />
      <CreateRoom />
    </React.Fragment>
  )
}

export default Index
