import Lenis from 'lenis'

import { isSafariFunction } from '../../utils/isSafari'

const isSafari = isSafariFunction()

let lenis

export const lenisInit = () => {
  if (window.screen.width > 1024 && !isSafari) {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (time) {
        return time === 1 ? 1 : 1 - Math.pow(2, -10 * time)
      },
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    })

    // Для того чтобы работали якоря с библиотекой
    for (const element of document.querySelectorAll('a[href^="#"]')) {
      element.addEventListener('click', event => {
        event.preventDefault()
        const id = element.getAttribute('href')?.slice(1)
        if (!id) return
        const target = document.querySelector(id)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }

    function raf(time) {
      lenis.raf(time)
      window.requestAnimationFrame(raf)
    }

    window.requestAnimationFrame(raf)
  }
}

export const destroyLenis = () => {
  lenis?.destroy()
}

export function stopLenis() {
  lenis?.stop()
}

export function resumeLenis() {
  lenis?.start()
}
