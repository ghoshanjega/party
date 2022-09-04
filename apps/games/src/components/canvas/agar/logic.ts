import { Viewport } from "@react-three/fiber";
import { C, Game, Player } from "interface";

type Field = Pick<Player, {
  [K in keyof Player]: Player[K] extends Function ? never : K
}[keyof Player]>

export const getPlayer = (game: Game, id: string, field?: {
  [K in keyof Player]: Player[K] extends Function ? never : K
}[keyof Player]) => {
  if (game) {
    const player = game.players[id]
    if (player) {
      if (field) {
        if (Object.hasOwn(player, field)) {
          return player[field]
        }
      }
      return player
    }
  }

  return undefined
}

export const calcDirection = (x: number, y: number) => {
  const rad = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y)
  const dir = rad * 180 / Math.PI
  // console.log("dr", x, y, rad, dir, "x: ", Math.sin(rad), ", y: ", Math.cos(rad))
  return rad
}

export const calcSpeed = (x: number, y: number, viewport: Viewport) => {
  const distance = Math.pow(viewport.width / 2 - x, 2) + Math.pow(viewport.height / 2 - y, 2)
  const max_distance = Math.pow(viewport.width / 2, 2) + Math.pow(viewport.height / 2, 2)
  return ((C.PLAYER_MAX_SPEED - C.PLAYER_MIN_SPEED) * (distance / max_distance)) + C.PLAYER_MIN_SPEED
}