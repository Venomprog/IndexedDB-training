import { disableScroll, enableScroll } from '../../../js/utils/scroll'

export const modalsInit = () => {
  const modalBtns = document.querySelectorAll('[data-modal-btn]')
  const modalWrappers = document.querySelectorAll('[data-modal-wrapper]')
  const closeBtns = document.querySelectorAll('[data-modal-close]')

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalWrapper = btn.closest('[data-modal-wrapper]')
      modalWrapper.classList.remove('active')
      document.querySelector('body').classList.remove('overflow')
      enableScroll()
      closeFrameVideo()
      checkIframePointer(false)
    })
  })

  modalBtns.forEach(btn => {
    const id = btn.dataset.modalBtn

    btn.addEventListener('click', () => {
      // console.log('modalsInit modalBtns click')

      const currentModal = document.querySelector(`[data-modal-wrapper="${id}"]`)

      modalWrappers.forEach(item => item.classList.remove('active'))
      currentModal.classList.add('active')
      document.querySelector('body').classList.add('overflow')
      disableScroll()
      document.addEventListener('keydown', closeOnEscFunc)
      if (btn.hasAttribute('data-frame-btn')) {
        const videoWrapper = currentModal.querySelector('[data-modal-video]')
        const url = btn.dataset.frameSrc // читаем путь из атрибута
        const isFrame = videoWrapper.querySelector('iframe')

        // Если внутри модалки уже есть фрейм, ему переприсваивается урл, чтобы подгрузить нужное видео
        if (isFrame) {
          isFrame.setAttribute('src', url)
        } else {
          // Если внутри модалки нету фрейма, то он создаётся с ссылкой из атрибута
          const frame = document.createElement('iframe')
          frame.setAttribute('src', url)
          frame.setAttribute('allowfullscreen', true)
          frame.setAttribute('allow', '')
          frame.classList.add('youtube-player')
          videoWrapper.append(frame)
        }

        checkIframePointer(true)
      }
    })
  })

  const closeOnEscFunc = function (e) {
    if (e.key == 'Escape' || e.keyCode === 27) {
      // console.log('closeOnEscFunc')

      modalWrappers.forEach(modal => {
        modal.classList.remove('active')
      })
      document.querySelector('body').classList.remove('overflow')
      enableScroll()
      document.removeEventListener('keydown', closeOnEscFunc)
    }
  }

  modalWrappers.forEach(modal => {
    const overlay = modal.querySelector('[data-modal-overlay]')
    overlay.addEventListener('click', () => {
      // console.log('overlay click')

      overlay.closest('[data-modal-wrapper]').classList.remove('active')
      document.querySelector('body').classList.remove('overflow')
      enableScroll()
      closeFrameVideo() // Остановка видео при закрытии модалки
      checkIframePointer(false) // Сбросс класса у фреймов, чтобы Ленис работал
    })
  })
}

export const closeFrameVideo = () => {
  const videoWrapper = document.querySelector('[data-modal-video]') // Находим на странице модалку с видео
  if (!videoWrapper) return

  const frame = videoWrapper.querySelector('iframe') // Находим внутри модалки фрейм

  if (!frame) return
  frame.setAttribute('src', '') // Переприсваиваем ему пустой урл, чтобы остановить видео
}

export const checkIframePointer = check => {
  const videoWrapper = document.querySelector('[data-modal-video]')
  if (!videoWrapper) return
  const frame = videoWrapper.querySelector('iframe') // Находим внутри модалки фрейм
  if (!frame) return

  if (check) {
    frame.classList.add('active')
  } else {
    frame.classList.remove('active')
  }
}
