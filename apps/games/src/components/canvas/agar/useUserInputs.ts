import { emit } from '@/helpers/socket'
import { useStore } from '@/helpers/store'
import { useThree } from '@react-three/fiber'
import { Events } from 'interface'
import { useEffect, useRef } from 'react'
import {
  MouseMove,
  TouchMove,
  startCapturingInput,
  stopCapturingInput,
} from './controls'
import { calcDirection, calcSpeed } from './logic'

const lag = 50

export function useUserInputs() {
  const { viewport } = useThree()
  const storeRef = useRef(useStore.getState())
  const store = storeRef.current
  const lastUpdate = useRef(Date.now())
  // TODO refactor these to a controls hook
  const handleMouseMove: MouseMove = (e) => {
    if (Date.now() > lastUpdate.current + lag) {
      emit(store, Events.INPUT, {
        dir: calcDirection(e.clientX, e.clientY),
        speed: calcSpeed(e.clientX, e.clientY, viewport),
      })
      lastUpdate.current = Date.now()
    }
  }

  const handleTouchEvent: TouchMove = (e) => {
    const touch = e.touches[0]
    if (Date.now() > lastUpdate.current + lag) {
      emit(store, Events.INPUT, {
        dir: calcDirection(touch.clientX, touch.clientY),
        speed: calcSpeed(touch.clientX, touch.clientY, viewport),
      })
      lastUpdate.current = Date.now()
    }
  }

  useEffect(() => {
    startCapturingInput(handleMouseMove, handleTouchEvent)
    return () => {
      stopCapturingInput(handleMouseMove, handleTouchEvent)
      emit(store, Events.LEAVE_ROOM, {})
    }
  }, [])
}
