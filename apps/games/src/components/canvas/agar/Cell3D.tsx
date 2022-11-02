import { useStore } from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { Agar } from 'interface'
import { AppProps } from 'next/app'
import React, { createRef, useState } from 'react'
import { useSprings, a } from '@react-spring/three'
import * as THREE from 'three'
import { RoundedBox, useTexture } from '@react-three/drei'
import { BufferGeometry, Material, Mesh } from 'three'
import { Physics, usePlane, useSphere } from '@react-three/cannon'

const Cell3D = ({ player }: { player: Agar.Player }): JSX.Element => {
  // This reference will give us direct access to the mesh
  const mesh = createRef<THREE.Mesh>()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const s = player.body.size

  return (
    <mesh
      // {...props}
      // // @ts-ignore
      // ref={ref}
      ref={mesh}
      position={[player.body.x, player.body.y, 0]}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[s, 64, 32]} />
      <meshStandardMaterial color={player.body.color} />
    </mesh>
  )
}

export default Cell3D
