import { useStore } from '@/helpers/store'
import { Physics } from '@react-three/cannon'
import { Center, Stars, Stats, Text3D } from '@react-three/drei'
import { Agar, GameRoomDto } from 'interface'
import { Leva, useControls } from 'leva'
import { useEffect, useRef } from 'react'
import Agars3D from './Agars3D'
import Cells3D from './Cells3D'
import { getPlayer } from './logic'
import { Rig } from './Rig'
import { useUserInputs } from './useUserInputs'

export const Scene = ({}) => {
  // Get zustand store transiently to reduce render
  const storeRef = useRef(useStore.getState())
  useEffect(() => useStore.subscribe((state) => (storeRef.current = state)), [])
  const store = storeRef.current

  const room = store.room as GameRoomDto<Agar.EngineDto, Agar.PlayerDto>

  const player = getPlayer<Agar.Player>(room.engine, store.socket.id)

  useUserInputs()

  const [{}, set] = useControls(() => ({
    Name: { value: 'default', editable: false },
    Score: { value: 0, editable: false },
    // x: { value: 0, editable: false },
    // y: { value: 0, editable: false },
    // direction: { value: 0, editable: false },
    // speed: { value: 0, editable: false },
    // size: { value: 0, editable: false },
    // join: button(() => joinGame(socket, 'newGuy'))
    Time: { value: 0, min: 0, max: 100, step: 1, editable: false },
    Latency: { value: 0, editable: false },
  }))

  useEffect(() => {
    if (player) {
      set({
        Name: player.username,
        // x: player.body.x,
        // y: player.body.y,
        // direction: player.body.direction,
        Score: player.score,
        // speed: player.body.speed,
        // size: player.body.size,
        Time: room.completed,
        Latency: room.latency,
      })
    }
  }, [player, set, room])

  if (room.engine && Object.keys(room.engine).length !== 0 && player) {
    return (
      <>
        <Rig>
          <color attach='background' args={['#000000']} />
          {/* <Stats showPanel={0} className='stats' /> */}
          <Physics iterations={1}>
            <Agars3D agars={room.engine.agars} />
            <Cells3D players={room.engine.players} />
          </Physics>

          <Stars
            radius={Agar.C.MAP_SIZE / 4}
            depth={Agar.C.MAP_SIZE / 8}
            count={Agar.C.MAP_SIZE * 3}
            factor={50}
            saturation={50}
            fade
            speed={0.05}
          />
        </Rig>
      </>
    )
  }
  return <>Loading</>
}
export default Scene
