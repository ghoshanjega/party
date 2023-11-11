import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const model = '/model/spaceship-transformed.glb'

const DomeSpaceShip = ({ color }: { color: string }) => {
  const { nodes, materials } = useGLTF(model)

  return (
    <>
      <mesh
        // @ts-ignore
        geometry={nodes.Plane002.geometry}
        material={materials['Material #31.026']}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={45}
      >
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  )
}

useGLTF.preload(model)

export default DomeSpaceShip
