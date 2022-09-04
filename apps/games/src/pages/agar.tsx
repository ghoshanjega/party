import Instructions from '@/components/dom/Instructions'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Box = dynamic(() => import('@/components/canvas/Box'), {
  ssr: false,
})

const Scene = dynamic(() => import('@/components/canvas/agar/Scene'), {
  ssr: false,
})

// Step 5 - delete Instructions components
const Page = (props) => {
  // const [data, setData] = useState(null)
  // const [isLoading, setLoading] = useState(false)
  // useEffect(() => {
  //   setLoading(true)
  //   fetch('/api/profile-data')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  // }, [])
  return (
    <>
      {/* <Instructions /> */}
    </>
  )
}

Page.r3f = (props) => (
  <>
    <Scene />
  </>
)

export default Page

// export async function getStaticProps() {
//   return {
//     props: {
//       title: 'Agar'
//     },
//   }
// }
