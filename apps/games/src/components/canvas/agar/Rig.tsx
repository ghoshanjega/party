import { useStore } from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { Agar, GameEngine } from 'interface'
import React, { ReactNode, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { getPlayer } from './logic'
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'

const SPOT_SCALE = 200

function Lights() {
  let spotPos = new THREE.Vector3(150, 150, 250)
  // let playerPos = new Vector3(150, 150, 250)
  // if (player) {
  //   spotPos = new Vector3(Math.sin(player.direction) * SPOT_SCALE, Math.cos(player.direction) * SPOT_SCALE, 200)
  //   playerPos = new Vector3(player.x, player.y, 0)
  // }
  return (
    <group>
      {/* <pointLight intensity={0.3} color={"#ff0000"} /> */}
      <ambientLight intensity={0.1} color={'#ff0000'} />
      {/* <spotLight
        // castShadow
        intensity={1}
        angle={Math.PI / 3}
        position={spotPos}
        penumbra={1}
        // shadow-mapSize-width={2048}
        // shadow-mapSize-height={2048}
        color={"#00ff00"}
        distance={500}
      /> */}
      <directionalLight position={spotPos} color={'#ffff00'} />
    </group>
  )
}

export const Rig = ({ children }: { children: ReactNode }) => {
  const { socket, room } = useStore()

  const player = getPlayer(room.engine as unknown as Agar.EngineDto, socket.id) as Agar.Player
  const outer = useRef<THREE.Group>(null!)
  const inner = useRef<THREE.Group>(null!)
  useFrame(({ camera, clock }) => {
    if (player) {
      camera.position.x = player.body.x
      camera.position.y = player.body.y
      camera.position.z = player.body.size * 2 + 1000
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
      <PerspectiveCamera
        makeDefault
        zoom={1}
        args={[]}
        near={10}
        // position={[500, 500, 100]}
        far={2000}
      />
      <color attach='background' args={['#f0f0f0']} />
      {/* <fog attach='fog' args={['white', 90, 110]} /> */}
      <Lights />
      <EffectComposer multisampling={0}>
        <SSAO
          samples={31}
          radius={0.1}
          intensity={30}
          luminanceInfluence={0.1}
          color='red'
        />
      </EffectComposer>
      {children}
    </>
  )
}
