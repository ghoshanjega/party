import { emit, setupListners } from '@/helpers/socket'
import { useStore } from '@/helpers/store'
import { Physics } from '@react-three/cannon'
import { Stats } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Events, Agar, GameRoomDto } from 'interface'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Agars3D from './Agars3D'
import Cells3D from './Cells3D'
import { MouseMove, startCapturingInput, stopCapturingInput } from './controls'
import { calcDirection, getPlayer, calcSpeed } from './logic'
import { Rig } from './Rig'

export const Scene = ({}) => {
  const clock = useRef(0)
  // const store = useStore()
  // Get zustand store transiently
  const storeRef = useRef(useStore.getState())
  useEffect(() => useStore.subscribe((state) => (storeRef.current = state)), [])
  let store = storeRef.current

  const room = store.room as GameRoomDto<Agar.EngineDto, Agar.PlayerDto>

  const { gl, scene, size, events, viewport } = useThree()

  const handleMouseMove: MouseMove = (e) => {
    emit(store, Events.INPUT, {
      dir: calcDirection(e.clientX, e.clientY),
      speed: calcSpeed(e.clientX, e.clientY, viewport),
    })
  }

  useEffect(() => {
    // setupListners(store, useStore.setState, router);
    startCapturingInput(handleMouseMove)
    return () => {
      // store.socket.off('connect')
      stopCapturingInput(handleMouseMove)
    }
  }, [])

  const player = getPlayer<Agar.Player>(room.engine, store.socket.id)

  const [{}, set] = useControls(() => ({
    name: { value: 'default', editable: false },
    score: { value: 0, editable: false },
    direction: { value: 0, editable: false },
    x: { value: 0, editable: false },
    y: { value: 0, editable: false },
    speed: { value: 0, editable: false },
    agarCount: { value: 0, editable: false },
    size: { value: 0, editable: false },
    // join: button(() => joinGame(socket, 'newGuy'))
  }))

  useEffect(() => {
    if (player) {
      set({
        name: player.username,
        x: player.body.x,
        y: player.body.y,
        direction: player.body.direction,
        score: player.score,
        speed: player.body.speed,
        size: player.body.size,
      })
    }
  }, [player, set, room.engine])

  if (room.engine && Object.keys(room.engine).length !== 0) {
    return (
      <>
        <Rig>
          <Stats showPanel={0} className='stats' />
          <Physics iterations={1}>
            <Agars3D agars={room.engine.agars} />
            <Cells3D players={room.engine.players} />
          </Physics>
        </Rig>
      </>
    )
  }
  return <>Loading</>
}
export default Scene
