import { useStore } from '@/helpers/store'
import { useFrame, useThree } from '@react-three/fiber'
import { Agar, GameEngine } from 'interface'
import React, { createRef, ReactNode, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { getPlayer } from './logic'
import {
  Center,
  Edges,
  GradientTexture,
  Line,
  OrthographicCamera,
  PerspectiveCamera,
  Text3D,
  Trail,
  useHelper,
} from '@react-three/drei'
import { SpotLightHelper } from 'three'
import Sugar3D from './Sugar3D'

const SPOT_SCALE = 200

function Lights({ player }: { player: Agar.Player }) {
  const { scene, camera } = useThree()

  useEffect(() => {
    const spot = new THREE.SpotLight('#ffffff', 0.5, undefined, 0.1, 0.5)
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

function Electron({ radius = 2.75, speed = 6, ...props }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    // @ts-ignore
    ref.current.position.set(
      Math.sin(t) * radius,
      (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25,
      0
    )
  })
  return (
    <group {...props}>
      <Trail
        local
        width={5}
        length={6}
        color={new THREE.Color(2, 1, 10)}
        attenuation={(t) => t * t}
      >
        {/* @ts-ignore */}
        <mesh ref={ref}>
          <pointLight distance={100} intensity={10} color={'white'} />
          <sphereGeometry args={[0.25]} />
          <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  )
}

export const Rig = ({ children }: { children: ReactNode }) => {
  const { socket, room } = useStore()

  const player = getPlayer(
    room.engine as unknown as Agar.EngineDto,
    socket.id
  ) as Agar.Player

  const score = useRef<THREE.Group>()

  useFrame(({ camera }) => {
    if (player) {
      // Zoom out when the player gets bigger
      const vec = new THREE.Vector3(
        player.body.x,
        player.body.y,
        player.body.size + 1000
      )
      camera.position.lerp(vec, 0.1)

      // Keep score in the corner
      const scorePosition = new THREE.Vector3(
        window.innerWidth / 3.5,
        -window.innerHeight / 3,
        -player.body.size - 1000
      )
      score.current && score.current.position.lerp(scorePosition, 0.1)
    }
  })

  return (
    <>
      <PerspectiveCamera
        makeDefault
        zoom={1}
        args={[]}
        near={10}
        far={Agar.C.MAP_SIZE}
      >
        <Center
          rotation={[0.3, 0, -0]}
          // @ts-ignore
          ref={score}
        >
          <Text3D
            curveSegments={9}
            bevelEnabled
            bevelSize={1}
            bevelThickness={6}
            // height={10}
            // lineHeight={0.5}
            letterSpacing={3}
            size={33}
            font='/fonts/Rowdies_Regular.json'
          >
            {`${Math.round(player.score)}`}
            <meshStandardMaterial color='white' />
            <Edges />
          </Text3D>
          <Center position={[-80, 20, 0]}>
            <mesh scale={20}>
              <Sugar3D />
            </mesh>
            <Center>
              <Electron position={[0, 0, 0]} speed={3} scale={20} />
            </Center>
          </Center>
        </Center>
      </PerspectiveCamera>
      <Lights player={player} />
      {children}
    </>
  )
}
