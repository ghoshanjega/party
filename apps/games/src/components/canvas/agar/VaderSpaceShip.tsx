import { useGLTF } from '@react-three/drei'
import { forwardRef, useLayoutEffect } from 'react'

const VaderSpaceShip = ({ color }: { color: string }) => {
  const { nodes, materials } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  )
  useLayoutEffect(() => {
    Object.values(materials).forEach((material) => {
      // @ts-ignore
      material.roughness = 0
    })
  }, [])
  return (
    <group
      dispose={null}
      scale={100}
      rotation={[-Math.PI / 2, 0, Math.PI ]}
      position={[0, 0, -1000]}
    >
      <mesh
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.Cube005.geometry}
        material={materials.Mat0}
      />
      <mesh
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.Cube005_1.geometry}
        material={materials.Mat1}
        material-color='grey'
      />
      <mesh
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.Cube005_2.geometry}
        material={materials.Mat2}
        material-envMapIntensity={0.2}
        material-color={color}
      />
      <mesh
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.Cube005_3.geometry}
        material={materials.Window_Frame}
      />
      <mesh
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.Cube005_4.geometry}
        material={materials.Mat4}
      />
      <mesh
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.Cube005_6.geometry}
        material={materials.Window}
      />
    </group>
  )
}

export default VaderSpaceShip
