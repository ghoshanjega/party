import { useStore } from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { Agar, GameEngine } from 'interface'
import React, { createRef, ReactNode, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { getPlayer } from './logic'
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'

const SPOT_SCALE = 200

function Lights({ player }: { player: Agar.Player }) {
  const directLight = createRef<THREE.DirectionalLight>()

  // let spotPos = new THREE.Vector3(150, 150, 250)
  // if (player) {
  // }
  // useFrame(() => {
  //   if (directLight.current && player) {
  //     const spotPos = new THREE.Vector3(
  //       Math.sin(player.body.direction) * SPOT_SCALE,
  //       Math.cos(player.body.direction) * SPOT_SCALE,
  //       200
  //     )
  //   }
  // })
  return (
    <group>
      {/* <pointLight
        distance={player.body.size * 5}
        position={(player.body.x, player.body.y, 0)}
      /> */}
      {/* <pointLight intensity={0.3} color={"#ff0000"} /> */}
      <ambientLight intensity={0.05} color={'#ffffff'} />
      {/* <spotLight
        // castShadow
        intensity={1}
        angle={Math.PI / 3}
        position={spotPos}
        penumbra={1}
        // shadow-mapSize-width={2048}
        // shadow-mapSize-height={2048}
        color={'#00ff00'}s
        distance={500}
      /> */}
      {/* <directionalLight position={spotPos} color={'#ffffff'} intensity={0.5} /> */}
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
      {/* <OrthographicCamera
        makeDefault
        zoom={1}
        position={[500, 500, 100]}
        far={2000}
      /> */}
      <PerspectiveCamera makeDefault zoom={1} args={[]} near={10} far={3000} />
      <color attach='background' args={['#282a36']} />
      {/* <fog attach='fog' near={0} far={10000} color={'white'} /> */}
      <Lights player={player} />
      {/* <EffectComposer multisampling={0}>
        <SSAO
          samples={31}
          radius={0.1}
          intensity={30}
          luminanceInfluence={0.1}
          color='red'
        />
      </EffectComposer> */}
      {children}
    </>
  )
}
