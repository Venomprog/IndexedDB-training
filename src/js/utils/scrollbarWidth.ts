export function scrollBarWidth() {
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${window.innerWidth - document.documentElement.clientWidth}px`
  )
}
