function isVisable(target): boolean {
  const computedStyle = window.getComputedStyle(target)
  return computedStyle.display !== 'none'
}

export function slideUp(target: HTMLElement, duration: number = 400, callback?: () => void): void {
  if (!isVisable(target)) return

  target.style.transitionProperty = 'height, margin, padding'
  target.style.transitionDuration = duration + 'ms'
  target.style.boxSizing = 'border-box'
  target.style.height = target.offsetHeight + 'px'

  target.offsetHeight

  target.style.overflow = 'hidden'
  target.style.height = '0'
  target.style.paddingTop = '0'
  target.style.paddingBottom = '0'
  target.style.marginTop = '0'
  target.style.marginBottom = '0'

  window.setTimeout(() => {
    target.style.display = 'none'
    target.style.removeProperty('height')
    target.style.removeProperty('padding-top')
    target.style.removeProperty('padding-bottom')
    target.style.removeProperty('margin-top')
    target.style.removeProperty('margin-bottom')
    target.style.removeProperty('overflow')
    target.style.removeProperty('transition-duration')
    target.style.removeProperty('transition-property')

    if (callback) {
      callback()
    }
  }, duration)
}

export function slideDown(
  target: HTMLElement,
  duration: number = 400,
  callback?: () => void
): void {
  if (isVisable(target)) return

  target.style.removeProperty('display')
  let display = window.getComputedStyle(target).display
  if (display === 'none') display = 'block'
  target.style.display = display

  const height = target.offsetHeight

  target.style.overflow = 'hidden'
  target.style.height = '0'
  target.style.paddingTop = '0'
  target.style.paddingBottom = '0'
  target.style.marginTop = '0'
  target.style.marginBottom = '0'

  target.offsetHeight

  target.style.boxSizing = 'border-box'
  target.style.transitionProperty = 'height, margin, padding'
  target.style.transitionDuration = duration + 'ms'
  target.style.height = height + 'px'

  target.style.removeProperty('padding-top')
  target.style.removeProperty('padding-bottom')
  target.style.removeProperty('margin-top')
  target.style.removeProperty('margin-bottom')

  window.setTimeout(() => {
    target.style.removeProperty('height')
    target.style.removeProperty('overflow')
    target.style.removeProperty('transition-duration')
    target.style.removeProperty('transition-property')

    if (callback) {
      callback()
    }
  }, duration)
}

export function slideToggle(
  target: HTMLElement,
  duration: number = 400,
  callback?: () => void
): void {
  if (isVisable(target)) {
    slideUp(target, duration, callback)
  } else {
    slideDown(target, duration, callback)
  }
}

export function initSlideFunction(): void {
  window['slideToggle'] = slideToggle
  window['slideDown'] = slideDown
  window['slideUp'] = slideUp
}
