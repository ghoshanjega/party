import { useRouter } from 'next/router'
import { useStore } from '@/helpers/store'
import { useEffect, useState } from 'react'
import Header from '@/config'
import Dom from '@/components/layout/dom'
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'
import { setupListners } from '@/helpers/socket'
import { SSRProvider, ThemeProvider } from '@primer/react'

import '@/styles/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Loader } from '@react-three/drei'

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  loading: () => <Loader />,
  ssr: true,
})

function App({
  Component,
  pageProps = { title: 'index' },
}: AppProps<{ title: string }>) {
  const store = useStore()

  const [isConnected, setIsConnected] = useState(store.socket.connected)
  const [lastPong, setLastPong] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (!store.room && router.pathname !== '/') {
      router.push('/')
    }
  }, [store.room, router])

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

    return () => {
      store.socket.off('connect')
      store.socket.off('disconnect')
      store.socket.off('pong')
    }
  }, [router, store, store.socket])

  useEffect(() => {
    useStore.setState({ router })
  }, [router])
  return (
    <SSRProvider>
      <ThemeProvider colorMode='dark'>
        <Header title={pageProps.title} />
        <Dom>
          <Component {...pageProps} />
        </Dom>
        {store.room && (Component as any)?.r3f && (
          <LCanvas>{(Component as any).r3f()}</LCanvas>
        )}
      </ThemeProvider>
    </SSRProvider>
  )
}

export default App
