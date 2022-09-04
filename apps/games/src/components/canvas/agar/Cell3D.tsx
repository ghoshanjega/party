import { useStore } from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { Agar, Agars, Player } from 'interface'
import { AppProps } from 'next/app'
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSprings, a } from '@react-spring/three'
import * as THREE from 'three'
import { RoundedBox, useTexture } from '@react-three/drei'
import { BufferGeometry, Material, Mesh } from 'three'
import { Physics, usePlane, useSphere } from '@react-three/cannon'


const Cell3D = ({ player }: { player: Player }): JSX.Element => {
  // This reference will give us direct access to the mesh
  const mesh = createRef<THREE.Mesh>()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const s = player.size

  // const [ref, api] = useSphere(() => ({ mass: 1, angularDamping: 0.1, linearDamping: 1, position: [0, 0, 0] }))
  // useFrame(() => {
  //   api.position.set(player.x, player.y, 0)
  // })
  return (

    <mesh
      // {...props}
      // // @ts-ignore
      // ref={ref}
      ref={mesh}
      position={[player.x, player.y, 0]}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <sphereGeometry args={[s, s, s]} />
      <meshStandardMaterial color={player.color} />
    </mesh>
  )

}

export default Cell3D
