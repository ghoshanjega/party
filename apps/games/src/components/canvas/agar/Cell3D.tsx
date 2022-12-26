import { useHelper } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Agar } from 'interface'
import React, { createRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { SpotLightHelper } from 'three'

const lightHoverDistance = new THREE.Vector3(0, 0, 100)

const Cell3D = ({ player }: { player: Agar.Player }): JSX.Element => {
  // This reference will give us direct access to the mesh
  const mesh = createRef<THREE.Mesh>()
  const spotLight = createRef<THREE.SpotLight>()
  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  const s = player.body.size

  useFrame(({}) => {
    if (mesh.current) {
      const position = new THREE.Vector3(player.body.x, player.body.y, 0)
      mesh.current.position.lerp(position, 0.1)
    }
  })

  return (
    <>
      <mesh
        ref={mesh}
        // position={position}
        // onClick={(event) => setActive(!active)}
        // onPointerOver={(event) => setHover(true)}
        // onPointerOut={(event) => setHover(false)}
      >
        <sphereGeometry args={[s, 64, 32]} />
        <meshStandardMaterial color={player.body.color} />
        {/* <pointLight distance={player.body.size * 5} color={'#f1fa8c'} /> */}
      </mesh>
    </>
  )
}

export default Cell3D
