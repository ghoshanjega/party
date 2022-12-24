import { useHelper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Agar } from 'interface'
import React, { createRef, useState } from 'react'
import * as THREE from 'three'
import { SpotLightHelper } from 'three'

const Cell3D = ({ player }: { player: Agar.Player }): JSX.Element => {
  // This reference will give us direct access to the mesh
  const mesh = createRef<THREE.Mesh>()
  const spotLight = createRef<THREE.SpotLight>()
  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  const s = player.body.size
  const position = new THREE.Vector3(player.body.x, player.body.y, 0)
  // const direction = new THREE.Vector3(
  //   Math.sin(player.body.direction) * Agar.C.MAP_SIZE,
  //   Math.cos(player.body.direction) * Agar.C.MAP_SIZE,
  //   0
  // )
  const direction = new THREE.Vector3(1000, 1000, 0)

  useFrame(({ mouse, viewport }) => {
    if (mesh.current) {
      mesh.current.position.lerp(position, 0.1)
      // mesh.current.rotateZ(player.body.direction)
      // mesh.current.attach(spotLight.current!)
    }
    if (spotLight.current) {
      const x = mouse.x * viewport.width
      const y = mouse.y * viewport.height
      // console.log('xy', x, y)
      spotLight.current.position.lerp(position, 0.1)
      // spotLight.current.target =new THREE.Vector3(x, y, 0)
      // spotLight.current.lookAt(direction)
      // const quaternion = new THREE.Quaternion()
      // quaternion.setFromAxisAngle(position, Math.PI / 2)
      // spotLight.current.setRotationFromQuaternion(quaternion)
    }
  })
  useHelper(spotLight, SpotLightHelper, 'cyan')

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
        <meshPhongMaterial emissive={player.body.color} />
        <pointLight distance={player.body.size * 5} color={'#f1fa8c'} />
      </mesh>
      {/* <spotLight intensity={1} angle={0.3} ref={spotLight} /> */}
    </>
  )
}

export default Cell3D
