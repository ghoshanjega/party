import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, Preload } from '@react-three/drei'
import { StoreState, useStore } from '@/helpers/store'
import { FC, ReactNode, Suspense, useEffect, useRef } from 'react'
import LAgars from '../canvas/agar/Agars3D'
import THREE from 'three'
import { Rig } from '../canvas/agar/Rig'

const LControl = () => {
  const dom = useStore((state) => state.dom)
  const control = useRef(null)

  useEffect(() => {
    if (control.current) {
      const domElement = dom.current
      const originalTouchAction = domElement.style['touch-action']
      domElement.style['touch-action'] = 'none'

      return () => {
        domElement.style['touch-action'] = originalTouchAction
      }
    }
  }, [dom, control])
  return <OrbitControls ref={control} domElement={dom.current} />
}

const LCanvas = ({ children }: { children: ReactNode }) => {
  const dom = useStore((state: StoreState) => state.dom)

  return (
    <Canvas
      // mode='concurrent'
      // style={{
      //   position: 'relative',
      //   top: 0,
      // }}
      // linear
      // flat
      // shadows
      // camera={{ position: [500, 500, 1000], fov: 50, far: 2000 }}
      shadows dpr={[1, 2]} gl={{ antialias: false }}
      onCreated={(state) => state.events.connect && state.events.connect(dom.current)}

    >
      <OrthographicCamera makeDefault zoom={1} position={[500, 500, 100]} far={2000} />
      {/* <LControl /> */}
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
