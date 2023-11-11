import { useFrame } from '@react-three/fiber'
import { Agar } from 'interface'
import React, { createRef, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import DomeSpaceShip from './DomeSpaceShip'
import VaderSpaceShip from './VaderSpaceShip'
import { calcSpeed } from './logic'

const lightHoverDistance = new THREE.Vector3(0, 0, 100)

const model = '/model/spaceship-transformed.glb'

const Cell3D = ({ player }: { player: Agar.Player }): JSX.Element => {
  // This reference will give us direct access to the mesh
  const { nodes, materials } = useGLTF(model)

  const cell = createRef<THREE.Mesh>()
  const group = createRef<THREE.Group>()
  const spotLight = createRef<THREE.SpotLight>()
  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  const s = player.body.size
  const headlight = createRef<THREE.PointLight>()

  useFrame((state) => {
    if (group.current && headlight.current) {
      const position = new THREE.Vector3(
        player.body.x,
        player.body.y,
        Math.sin(state.clock.getElapsedTime()) * 50 + 50
      )

      // Update player position
      group.current.position.lerp(position, 0.1)
      // console.log(group.current.position)

      // Update the player's rotation
      const rotation = new THREE.Quaternion()
      rotation.setFromEuler(
        new THREE.Euler(
          0,
          0,
          -player.body.direction,
          // -Math.sin(state.clock.getElapsedTime()) * 0.2,
          'XYZ'
        )
      )
      group.current.quaternion.slerp(rotation, 0.05)

      // Update the headlights to shine in front of the player
      headlight.current.position.set(
        0,
        calcSpeed(state.mouse.x, state.mouse.y, state.viewport)/4,
        50
      )
      headlight.current.distance =
        Math.max(Math.abs(state.mouse.x), Math.abs(state.mouse.y)) * 100
    }
  })

  return (
    <>
      <group ref={group}>
        <DomeSpaceShip color={player.body.color} />
        {/* <VaderSpaceShip /> */}

        <pointLight
          ref={headlight}
          distance={50}
          intensity={8}
          color={player.body.color}
        >
          <mesh scale={[1, 1, 6]}>
            <dodecahedronGeometry args={[4, 0]} />
          </mesh>
        </pointLight>
      </group>
    </>
  )
}

export default Cell3D
