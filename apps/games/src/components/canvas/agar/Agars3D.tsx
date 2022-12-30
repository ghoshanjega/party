import { Instances } from '@react-three/drei'
import { Agar } from 'interface'
import React, { Fragment, useRef } from 'react'
import { Color } from 'three'
import Agar3D from './Agar3D'

const Agars3D = ({ agars }: { agars: { [key: string]: Agar.AgarDto } }) => {
  const ref = useRef()
  const agarsArray = Object.values(agars || {}).filter((a) => a != null)
  if (agarsArray.length > 0) {
    return (
      <Instances
        limit={agarsArray.length}
        // @ts-ignore
        ref={ref}
        castShadow
        receiveShadow
        position={[0, 10, 0]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial roughness={0} color={'#5550ff'} />
        {agarsArray.map((agar, i) => (
          <Agar3D key={i} agar={agar} />
        ))}
      </Instances>
    )
  }
  return <Fragment />
}

export default Agars3D
