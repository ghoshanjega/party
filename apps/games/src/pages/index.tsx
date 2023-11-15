import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { emit } from '@/helpers/socket'
import { useStore } from '@/helpers/store'
import {
  Agar,
  Events,
  GameEngineDto,
  GamePlayerDto,
  GameRoomDto,
} from 'interface'
import {
  Header,
  StyledOcticon,
  Avatar,
  Box,
  Label,
  Button,
  Dialog,
  Text,
  AvatarPair,
} from '@primer/react'
import {
  MarkGithubIcon,
  PersonIcon,
  StarFillIcon,
  TrophyIcon,
} from '@primer/octicons-react'
import { getPlayer } from '@/components/canvas/agar/logic'
import { getRooms } from '@/helpers/api'
import { useQuery } from 'react-query'

const Navbar = () => {
  return (
    <div className='navbar'>
      <Header.Item>
        <Header.Link href='#'>
          <StyledOcticon icon={StarFillIcon} size={32} sx={{ mr: 2 }} />
          <span>Party</span>
        </Header.Link>
      </Header.Item>
      <Header.Item>
        {' '}
        <Header.Link
          href='https://github.com/ghoshanjega/party'
          target={'_blank'}
        >
          <StyledOcticon icon={MarkGithubIcon} size={22} sx={{ mr: 2 }} />
        </Header.Link>
      </Header.Item>
    </div>
  )
}

const RoomSelector = () => {
  const storeRef = useRef(useStore.getState())
  useEffect(() => useStore.subscribe((state) => (storeRef.current = state)), [])
  const store = storeRef.current
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await fetch(getRooms())
      return res.json() as unknown as {
        [key: string]: GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto>
      }
    },
    // Refetch the data every second
    refetchInterval: 2000,
  })
  const handleJoin = (
    room: GameRoomDto<GameEngineDto<GamePlayerDto>, GamePlayerDto>
  ) => {
    emit(store, Events.JOIN_ROOM, { roomId: room.name })
  }
  if (data && data.rooms) {
    return (
      <Box p={3}>
        <Label variant='success'>Join room</Label>
        <Box display='flex'>
          {Object.entries(data.rooms).map(([key, room]) => (
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
                  {/* {Object.values(room.engine.players).length} */}
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

interface Game {
  id: string
  label: string
  image: string
  instructions: ReactNode
}
const games: Game[] = [
  {
    id: Agar.Engine.identifier,
    label: Agar.Engine.label,
    image: '/img/spaceJunkies.png',
    instructions: (
      <Text color='fg.onEmphasis' fontSize={10}>
        Collect the debt before a debt collector collects you
      </Text>
    ),
  },
]

const GameAvatar = ({ player }: { player: GamePlayerDto }) => {
  const [isHovered, setIsHovered] = useState(true)
  return (
    <Box
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      borderColor='border.default'
      borderWidth={2}
      borderRadius={10}
      borderStyle={isHovered ? 'groove' : 'hidden'}
      p={2}
      display={'flex'}
    >
      <AvatarPair>
        <Avatar
          src={`https://avatars.dicebear.com/api/adventurer/${player.username}.svg`}
        />
        <Avatar src={player.ready ? `/img/check.png` : `/img/idle.png`} />
      </AvatarPair>
      {isHovered && (
        <Box
          p={1}
          display={'flex'}
          flexDirection={'column'}
          justifyContent='flex-end'
        >
          <Text color='fg.onEmphasis' fontSize={10}>
            {player.username}
          </Text>
          <Text
            color={player.ready ? 'green' : 'grey'}
            fontSize={10}
            display={'flex'}
            className='justify-content-end'
          >
            {player.ready ? 'Ready' : 'Joined'}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const JoinOrCreateGameModal = ({
  isOpen,
  game,
  setIsOpen,
}: {
  isOpen: boolean
  game: Game
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const storeRef = useRef(useStore.getState())
  useEffect(() => useStore.subscribe((state) => (storeRef.current = state)), [])
  const store = storeRef.current

  const handleCreateNewRoom = () => {
    emit(store, Events.CREATE_AND_JOIN_ROOM, { gameId: game.id })
  }

  const handleReady = (roomId: string) => {
    emit(store, Events.READY, { roomId })
  }

  const handleStartGame = (roomId: string) => {
    emit(store, Events.START, { roomId })
  }

  const player = store.room
    ? getPlayer<Agar.Player>(store.room.engine, store.socket.id)
    : undefined
  return (
    <Dialog
      isOpen={isOpen}
      // returnFocusRef={returnFocusRef}
      onDismiss={() => {
        console.log("yoyo")
        setIsOpen(isOpen => !isOpen)}
      }
      aria-labelledby='label'
    >
      <Dialog.Header color='fg.onEmphasis'>
        <TrophyIcon verticalAlign='text-bottom' />{' '}
        <span className='badge'>{game.label}</span>
      </Dialog.Header>
      <Box p={3}>
        {/* Create new room */}
        {store.room == null && (
          <div className=' d-flex justify-content-between'>
            <Text id='label' fontFamily='sans-serif' color='fg.onEmphasis'>
              Create new multiplayer room
            </Text>
            <Button variant='default' onClick={handleCreateNewRoom}>
              New room
            </Button>
          </div>
        )}

        {/* New room created, show all players, status */}
        {store.room && store.room.state === 'lobby' && (
          <Box display={'flex'}>
            {Object.entries(store.room.engine.players).map(([key, player]) => {
              return <GameAvatar key={key} player={player} />
            })}
          </Box>
        )}

        {player && !player.ready && (
          <Box display='flex' mt={3} justifyContent='flex-end'>
            <Button
              variant='primary'
              onClick={() => handleReady(store.room.name)}
            >
              Ready
            </Button>
          </Box>
        )}

        {player && player.isLeader && (
          <Box display='flex' mt={3} justifyContent='flex-end'>
            <Button
              variant='primary'
              onClick={() => handleStartGame(store.room.name)}
            >
              Start game
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}

const GameCard = ({
  game,
  handleGameClick,
}: {
  game: Game
  handleGameClick: (game: Game) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <Box
        p={2}
        style={{
          width: '450px',
          height: '200px',
          backgroundImage: `url(${game.image})`,
          cursor: 'pointer',
          opacity: '0.9',
        }}
        className={`d-flex rounded-2 align-items-start justify-content-between`}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={() => handleGameClick(game)}
      >
        <span
          className='d-inline-flex badge  text-white text-wrap fs-3 '
          style={{ textShadow: '4px 4px 10px rgba(0,0,0,0.9)' }}
        >
          {game.label}
        </span>
        {isHovered && (
          <span className='d-flex align-self-end p-3 badge'>PLAY!</span>
        )}
      </Box>
    </>
  )
}

const GameLibrary = ({
  handleGameClick,
}: {
  handleGameClick: (game: Game) => void
}) => {
  return (
    <Box p={3}>
      <Label variant='success'>Game Library</Label>
      <Box display='flex' py={3}>
        {games.map((game) => (
          <GameCard
            game={game}
            key={game.id}
            handleGameClick={handleGameClick}
          />
        ))}
      </Box>
    </Box>
  )
}

function Index() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game>(games[0])

  const storeRef = useRef(useStore.getState())
  useEffect(() => useStore.subscribe((state) => (storeRef.current = state)), [])
  const store = storeRef.current

  // const returnFocusRef = React.useRef(null)
  const handleGameClick = (game: Game) => {
    setSelectedGame(game)
    setIsOpen(true)
  }

  return (
    <div className='flex flex-grow-1 flex-column'>
      <Navbar />
      <Box p={3}>
        <GameLibrary handleGameClick={handleGameClick} />
        <RoomSelector />
      </Box>
      <JoinOrCreateGameModal
        game={selectedGame}
        isOpen={isOpen || (store.room && store.room.state === 'lobby')}
        setIsOpen={setIsOpen}
      />
    </div>
  )
}

export default Index
