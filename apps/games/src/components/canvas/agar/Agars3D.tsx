import { Instances } from '@react-three/drei'
import { Agars } from 'interface'
import React, { Fragment, useRef } from 'react'
import Agar3D from './Agar3D'


const Agars3D = ({ agars }: { agars: Agars }) => {
  const ref = useRef()
  const agarsArray = Object.values(agars || {}).filter(a => a != null)
  if (agarsArray.length > 0) {
    return (
      // <Fragment>
      //   {
      //     agarsArray.map(ag => <Agar3D agar={ag} key={ag.id} />)
      //   }
      // </Fragment>
      <Instances limit={agarsArray.length} ref={ref} castShadow receiveShadow position={[0, 10, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial roughness={0} color="#f0f0f0" />
        {agarsArray.map((agar, i) => (
          <Agar3D key={i} agar={agar} />
        ))}
      </Instances>
    )
  }
  return <Fragment />
}

export default Agars3D
