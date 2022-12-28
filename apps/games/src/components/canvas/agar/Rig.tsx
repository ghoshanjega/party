import { useStore } from '@/helpers/store'
import { useFrame, useThree } from '@react-three/fiber'
import { Agar, GameEngine } from 'interface'
import React, { createRef, ReactNode, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { getPlayer } from './logic'
import {
  OrthographicCamera,
  PerspectiveCamera,
  useHelper,
} from '@react-three/drei'
import { SpotLightHelper } from 'three'

const SPOT_SCALE = 200

function Lights({ player }: { player: Agar.Player }) {
  const { scene, camera } = useThree()

  useEffect(() => {
    const spot = new THREE.SpotLight('#ffffff', 0.5, undefined, 0.2, 0.5)
    camera.add(spot)
    scene.add(spot.target)
  }, [camera, scene])

  useFrame(() => {
    // @ts-ignore
    const spot: THREE.SpotLight = camera.children.find((r) => r.isSpotLight)
    const playerPosition = new THREE.Vector3(player.body.x, player.body.y, 0)
    spot.target.position.lerp(playerPosition, 0.1)
  })
  return (
    <group>
      <ambientLight intensity={0.1} color={'#ffffff'} />
    </group>
  )
}

export const Rig = ({ children }: { children: ReactNode }) => {
  const { socket, room } = useStore()

  const player = getPlayer(
    room.engine as unknown as Agar.EngineDto,
    socket.id
  ) as Agar.Player

  useFrame(({ camera }) => {
    if (player) {
      const vec = new THREE.Vector3(
        player.body.x,
        player.body.y,
        player.body.size * 2 + 1000
      )
      camera.position.lerp(vec, 0.1)
    }
  })
  return (
    <>
      <PerspectiveCamera makeDefault zoom={1} args={[]} near={10} far={3000} />

      {/* <fog attach='fog' near={0} far={10000} color={'white'} /> */}
      <Lights player={player} />
      {children}
    </>
  )
}
