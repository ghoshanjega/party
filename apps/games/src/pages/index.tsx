import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { emit } from '@/helpers/socket'
import { useStore } from '@/helpers/store'
import { useGetRooms } from '@/helpers/useGetRooms'
import { Events, GameEngineDto, GamePlayerDto, GameRoomDto } from 'interface'
import {
  Header,
  StyledOcticon,
  Avatar,
  Box,
  Label,
  FormControl,
  TextInput,
  Button,
} from '@primer/react'
import { PersonIcon, StarFillIcon } from '@primer/octicons-react'

const Navbar = () => {
  const { socket } = useStore()
  return (
    <Header>
      <Header.Item>
        <Header.Link href='#'>
          <StyledOcticon icon={StarFillIcon} size={32} sx={{ mr: 2 }} />
          <span>Party</span>
        </Header.Link>
      </Header.Item>
      {/* <Header.Item full>Menu</Header.Item> */}
      {/* <Header.Item mr={0}>
        <Avatar
          src='https://github.com/octocat.png'
          size={20}
          square
          alt='@octocat'
        />
      </Header.Item> */}
    </Header>
  )
}

const RoomSelector = () => {
  const store = useStore()
  const rooms = useGetRooms()
  const handleJoin = (
    room: GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto>
  ) => {
    emit(store, Events.JOIN_ROOM, { roomId: room.name })
  }
  if (rooms) {
    return (
      <Box
        borderColor='border.default'
        borderWidth={1}
        borderStyle='solid'
        p={3}
      >
        <Label>Join room</Label>
        <Box display='flex'>
          {Object.entries(rooms).map(([key, room]) => (
            <Box p={3} key={key}>
              <Button
                style={{
                  width: '150px',
                  height: '80px',
                }}
                onClick={() => handleJoin(room)}
                className={`d-flex flex-column justify-content-center 
                align-items-center rounded-2 bg-primary`}
              >
                <span className='badge'>{room.name}</span>
                <br />
                <span className='badge'>
                  {Object.values(room.engine.players).length}
                  <PersonIcon size={16} />
                </span>
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
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
    <Box
      borderColor='border.default'
      borderWidth={1}
      borderStyle='solid'
      p={3}
      // height={'300px'}
    >
      <Label>Create room</Label>
      <div className='p-3'>
        <FormControl>
          <FormControl.Label>Room name</FormControl.Label>
          <TextInput block onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <Button onClick={handleCreate} disabled={name === ''} className='my-2'>
          Create
        </Button>
      </div>
    </Box>
  )
}
const games = {
  agar: {
    label: 'Agar',
    image: '/img/agar.png',
  },
}

const GameLibrary = () => {
  return (
    <Box
      borderColor='border.default'
      borderWidth={1}
      borderStyle='solid'
      p={3}
      // height={'300px'}
    >
      <Label>Game Library</Label>
      <Box display='flex'>
        {Object.entries(games).map(([key, game]) => (
          <Box p={3} key={key}>
            <div
              style={{
                width: '150px',
                height: '200px',
              }}
              className={`d-flex flex-column justify-content-center 
                align-items-center rounded-2 bg-dark bg-gradient`}
            >
              <span className='badge text-wrap fs-3'>{game.label}</span>
            </div>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function Index() {
  return (
    <React.Fragment>
      <Navbar />
      {/* <TopBar></TopBar> */}

      <CreateRoom />
      <RoomSelector />
      <GameLibrary />
    </React.Fragment>
  )
}

export default Index
