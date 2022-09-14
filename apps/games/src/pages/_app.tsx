import { useRouter } from 'next/router'
import { useStore } from '@/helpers/store'
import { useEffect, useState } from 'react'
import Header from '@/config'
import Dom from '@/components/layout/dom'
import '@/styles/index.css'
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'
import { C } from 'interface'


import 'bootstrap/dist/css/bootstrap.css'



const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  loading: () => <>loading</>,
  ssr: true,
})


function App({ Component, pageProps = { title: 'index' } }: AppProps) {
  const { socket } = useStore()

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });
    sendPing()
    // setupListners(socket, (game) => useStore.setState({ game }))

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  useEffect(() => {
    useStore.setState({ router })
  }, [router])



  return (
    <>
      <Header title={pageProps.title} />
      <Dom>
        <Component {...pageProps} />
      </Dom>
      {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
    </>
  )
}

export default App
