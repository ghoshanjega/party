import { emit, setupListners } from '@/helpers/socket'
import { useStore } from '@/helpers/store'
import { Physics } from '@react-three/cannon'
import { Stars, Stats } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Events, Agar, GameRoomDto } from 'interface'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Agars3D from './Agars3D'
import Cells3D from './Cells3D'
import {
  MouseMove,
  startCapturingInput,
  stopCapturingInput,
  TouchMove,
} from './controls'
import { calcDirection, getPlayer, calcSpeed } from './logic'
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
    name: { value: 'default', editable: false },
    score: { value: 0, editable: false },

    x: { value: 0, editable: false },
    y: { value: 0, editable: false },
    // direction: { value: 0, editable: false },
    // speed: { value: 0, editable: false },
    size: { value: 0, editable: false },
    // join: button(() => joinGame(socket, 'newGuy'))
  }))

  useEffect(() => {
    if (player) {
      set({
        name: player.username,
        x: player.body.x,
        y: player.body.y,
        // direction: player.body.direction,
        score: player.score,
        // speed: player.body.speed,
        size: player.body.size,
      })
    }
  }, [player, set, room.engine])

  if (room.engine && Object.keys(room.engine).length !== 0 && player) {
    return (
      <>
        <Rig>
          <color attach='background' args={['#000000']} />
          <Stats showPanel={0} className='stats' />
          <Physics iterations={1}>
            <Agars3D agars={room.engine.agars} />
            <Cells3D players={room.engine.players} />
          </Physics>
          <Stars
            radius={100}
            depth={Agar.C.MAP_SIZE / 2}
            count={5000}
            factor={40}
            saturation={1}
            fade
            speed={1}
          />
        </Rig>
      </>
    )
  }
  return <>Loading</>
}
export default Scene
