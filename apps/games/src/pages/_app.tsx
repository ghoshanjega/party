import { useRouter } from 'next/router'
import { useStore } from '@/helpers/store'
import { useEffect, useState } from 'react'
import Header from '@/config'
import Dom from '@/components/layout/dom'
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'
import { setupListners } from '@/helpers/socket'
import { Theme } from 'react-daisyui'

import '@/styles/index.css'
import 'bootstrap/dist/css/bootstrap.css'

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  loading: () => <>loading</>,
  ssr: true,
})

function App({ Component, pageProps = { title: 'index' } }: AppProps) {
  const store = useStore()

  const [isConnected, setIsConnected] = useState(store.socket.connected)
  const [lastPong, setLastPong] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (!store.room) {
      router.push('/')
    }
  }, [store.room])

  useEffect(() => {
    store.socket.on('connect', () => {
      setIsConnected(true)
    })

    store.socket.on('disconnect', () => {
      router.push('/')
    })

    store.socket.on('pong', () => {
      setLastPong(new Date().toISOString())
    })

    setupListners(store, useStore.setState, router)
    // setupListners(socket, (game) => useStore.setState({ game }))

    return () => {
      store.socket.off('connect')
      store.socket.off('disconnect')
      store.socket.off('pong')
    }
  }, [store.socket])

  useEffect(() => {
    useStore.setState({ router })
  }, [router])

  return (
    <>
      <Header title={pageProps.title} />
      <Dom>
        <Component {...pageProps} />
      </Dom>
      {store.room && Component?.r3f && <LCanvas>{Component.r3f()}</LCanvas>}
    </>
  )
}

export default App
