import { getPlayer } from '@/components/canvas/agar/logic'
import { Instructions } from '@/components/dom/Instructions'
import { useStore } from '@/helpers/store'
import { Label } from '@primer/react'
import { Agar, GameRoomDto } from 'interface'
import { Leva } from 'leva'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

const Scene = dynamic(() => import('@/components/canvas/agar/Scene'), {
  ssr: false,
})

const Page = () => {
  // const storeRef = useRef(useStore.getState())
  // useEffect(() => useStore.subscribe((state) => (storeRef.current = state)), [])
  // const store = storeRef.current
  // const room = store.room as GameRoomDto<Agar.EngineDto, Agar.PlayerDto>
  // const player = getPlayer<Agar.Player>(room.engine, store.socket.id)

  return (
    <>
      <Instructions>
        Collect all the trash before the other pirates. Watchout for any This is
        a minimal starter for Nextjs + React-three-fiber and Threejs. Click on
        the <span className='text-cyan-200'>atoms nucleus</span> to navigate to
        the <span className='text-green-200'>/blob</span> page. OrbitControls
        are enabled by default.
      </Instructions>
      <Leva
        titleBar={{
          title: <Label variant='success'>{Agar.C.NAME}</Label>,
          filter: false,
        }}
      />
    </>
  )
}

Page.r3f = () => (
  <>
    <Scene />
  </>
)

export default Page
