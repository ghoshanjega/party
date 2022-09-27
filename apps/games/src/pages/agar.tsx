import { useStore } from '@/helpers/store'
import dynamic from 'next/dynamic'

const Box = dynamic(() => import('@/components/canvas/Box'), {
  ssr: false,
})

const Scene = dynamic(() => import('@/components/canvas/agar/Scene'), {
  ssr: false,
})

const Page = () => {
  return <></>
}

Page.r3f = () => (
  <>
    <Scene />
  </>
)

export default Page
