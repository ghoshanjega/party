import { TopBar } from '@/components/layout/TopBar'
import { useStore } from '@/helpers/store'
import { useGetRooms } from '@/helpers/useGetRooms'
import { C } from 'interface'
import React, { useState } from 'react'


const Navbar = () => {
  const { socket } = useStore()
  return (
    <div className="row">
      <div className='column'>
        Party games
      </div>
    </div>
  )
}

const RoomSelector = () => {
  const rooms = useGetRooms()
  if (rooms) {
    return (
      <div className='w-100'>
        {Object.entries(rooms).map(([key, room]) => (
          <div id={key} className="w-100 p-3 d-flex justify-content-between">
            <div>
              {room.name}
            </div>
            <div>
              <button>join</button>
            </div>
          </div>
        ))}
      </div>
    )
  }
  return <></>
}

const CreateRoom = () => {
  const [name, setName] = useState("")
  const { socket } = useStore();

  const handleCreate = () => {
    socket.emit(C.MSG_TYPES.JOIN_ROOM, name)
  }

  return (
    <div className='p-5'>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Room name</label>
        <input type="text" className="form-control" id="name" aria-describedby="Room name" onChange={(e) => setName(e.target.value)} />
      </div>
      <button onClick={handleCreate} disabled={name === ""} className="btn btn-primary">Create room</button>
    </div>

  )
}

function Index() {
  return (
    <React.Fragment>
      <TopBar>

      </TopBar>
      <RoomSelector />
      <CreateRoom />

    </React.Fragment>
  )
}

export default Index