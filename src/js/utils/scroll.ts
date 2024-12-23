import { BREAKPOINT_DESKTOP } from '../config'
import { resumeLenis, stopLenis } from '../libs/lenis/lenis'
import { isSafariFunction } from './isSafari'

const isSafari = isSafariFunction()
export function disableScroll() {
  document.querySelector('body')!.classList.add('overflow-scroll')

  if (window.screen.width > BREAKPOINT_DESKTOP && !isSafari) {
    stopLenis()
  }
}
export function enableScroll() {
  document.querySelector('body')!.classList.remove('overflow-scroll')
  if (window.screen.width > BREAKPOINT_DESKTOP && !isSafari) {
    resumeLenis()
  }
}
