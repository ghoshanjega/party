import { C } from './Constants'

export const randomPosInMap = () => {
  const x = Math.floor(Math.random() * C.MAP_SIZE)
  const y = Math.floor(Math.random() * C.MAP_SIZE)
  return { x, y }
}

export const randomSize = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16)
