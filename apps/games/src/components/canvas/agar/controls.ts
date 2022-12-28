export type MouseMove = (e: MouseEvent) => void
export type TouchMove = (e: TouchEvent) => void
export type InputMove = MouseMove | TouchMove

export function startCapturingInput(
  onMouseInput: MouseMove,
  onTouchInput: TouchMove
) {
  window.addEventListener('mousemove', onMouseInput)
  window.addEventListener('touchmove', onTouchInput)
}

export function stopCapturingInput(
  onMouseInput: MouseMove,
  onTouchInput: TouchMove
) {
  window.removeEventListener('mousemove', onMouseInput)
  window.removeEventListener('touchmove', onTouchInput)
}
