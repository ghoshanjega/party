import { useStore } from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { Agar} from 'interface'
import { AppProps } from 'next/app'
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSprings, a } from '@react-spring/three'
import * as THREE from 'three'
import { Instance, RoundedBox } from '@react-three/drei'
import { BufferGeometry, Material, Mesh } from 'three'
import { useSphere } from '@react-three/cannon'

const Agar3D = ({ agar }: { agar: Agar.Agar }): JSX.Element => {
  // const mesh = createRef<THREE.Mesh>()
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  // const s = agar.size
  // return (
  //   <mesh
  //     // {...props}
  //     ref={mesh}
  //     position={[agar.x, agar.y, 0]}
  //     scale={active ? 1.5 : 1}
  //     onClick={(event) => setActive(!active)}
  //     onPointerOver={(event) => setHover(true)}
  //     onPointerOut={(event) => setHover(false)}>
  //     <sphereGeometry args={[s, s, s]} />
  //     <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
  //   </mesh>
  // )
  const ref = useRef()
  useFrame((state) => {
    // const t = factor + state.clock.elapsedTime * (speed / 2)
    if (ref.current) {
      ref.current.scale.setScalar(agar.size)
      ref.current.position.set(agar.x, agar.y, 0)
    }

  })
  return <Instance ref={ref} />

}

export default Agar3D
