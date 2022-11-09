import { useFrame } from '@react-three/fiber'
import { Agar } from 'interface'
import React, { createRef, useState } from 'react'
import * as THREE from 'three'

const Cell3D = ({ player }: { player: Agar.Player }): JSX.Element => {
  // This reference will give us direct access to the mesh
  const mesh = createRef<THREE.Mesh>()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const s = player.body.size

  useFrame(({}) => {
    const position = new THREE.Vector3(player.body.x, player.body.y, 0)
    if (mesh.current) {
      mesh.current.position.lerp(position, 0.1)
    }
  })

  return (
    <mesh
      ref={mesh}
      // position={position}
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
