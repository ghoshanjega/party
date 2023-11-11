import { GradientTexture } from '@react-three/drei'
import React from 'react'

const Sugar3D = () => (
  <>
    <dodecahedronGeometry args={[1, 0]} />
    <meshStandardMaterial roughness={0.5}>
      <GradientTexture stops={[0, 1]} colors={['black', 'white', 'grey']} />
    </meshStandardMaterial>
  </>
)

export default Sugar3D
