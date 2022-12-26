import { useStore } from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { Agar } from 'interface'
import { AppProps } from 'next/app'
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSprings, a } from '@react-spring/three'
import * as THREE from 'three'
import { Instance, RoundedBox } from '@react-three/drei'
import { BufferGeometry, Material, Mesh } from 'three'
import { useSphere } from '@react-three/cannon'

const Agar3D = ({ agar }: { agar: Agar.AgarDto }): JSX.Element => {
  const ref = createRef<THREE.InstancedMesh>()
  useFrame(() => {
    if (ref.current) {
      ref.current.scale.setScalar(agar.size)
      ref.current.position.set(agar.x, agar.y, 0)
    }
  })
  return <Instance ref={ref} />
}

export default Agar3D
