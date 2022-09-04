

export type MouseMove = (e: MouseEvent) => void

export function startCapturingInput(onMouseInput: MouseMove) {
  window.addEventListener('mousemove', onMouseInput);
  // window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput(onMouseInput: MouseMove) {
  window.removeEventListener('mousemove', onMouseInput);
  // window.removeEventListener('touchmove', onTouchInput);
}