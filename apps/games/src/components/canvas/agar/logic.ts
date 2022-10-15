import { Viewport } from '@react-three/fiber'
import { Agar } from 'interface'

export const getPlayer = (game: Agar.EngineDto, id: string) => {
  if (game) {
    const player = game.players[id]
    if (player) {
      return player as Agar.Player
    }
  }
  return null
}

export const calcDirection = (x: number, y: number) => {
  const rad = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y)
  const dir = (rad * 180) / Math.PI
  return rad
}

export const calcSpeed = (x: number, y: number, viewport: Viewport) => {
  const width = window.innerWidth
  const height = window.innerHeight

  const distance = Math.pow(width / 2 - x, 2) + Math.pow(height / 2 - y, 2)
  const max_distance = Math.pow(width / 2, 2) + Math.pow(height / 2, 2) / 2
  return (
    (Agar.C.PLAYER_MAX_SPEED - Agar.C.PLAYER_MIN_SPEED) *
    (distance / max_distance) +
    Agar.C.PLAYER_MIN_SPEED
  )
}
