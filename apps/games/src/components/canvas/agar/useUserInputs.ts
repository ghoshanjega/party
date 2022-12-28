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

export function useUserInputs() {
  const { viewport } = useThree()
  const storeRef = useRef(useStore.getState())
  const store = storeRef.current
  // TODO refactor these to a controls hook
  const handleMouseMove: MouseMove = (e) => {
    emit(store, Events.INPUT, {
      dir: calcDirection(e.clientX, e.clientY),
      speed: calcSpeed(e.clientX, e.clientY, viewport),
    })
  }

  const handleTouchEvent: TouchMove = (e) => {
    const touch = e.touches[0]
    emit(store, Events.INPUT, {
      dir: calcDirection(touch.clientX, touch.clientY),
      speed: calcSpeed(touch.clientX, touch.clientY, viewport),
    })
  }

  useEffect(() => {
    startCapturingInput(handleMouseMove, handleTouchEvent)
    return () => {
      stopCapturingInput(handleMouseMove, handleTouchEvent)
      emit(store, Events.LEAVE_ROOM, {})
    }
  }, [])
}
