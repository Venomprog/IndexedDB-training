import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sequence = () => {
  const sequences = document.querySelectorAll('[data-animation=sequence]')

  if (!sequences.length) return

  sequences.forEach(sequence => {
    const sequenceCtx = sequence.getContext('2d'),
      modelPath = sequence.dataset.sequencePath,
      framesCount = +sequence.dataset.sequenceCount,
      speed = +sequence.dataset.sequenceSpeed,
      trigger = sequence.dataset.sequenceTrigger || 'grab',
      baseScrollOffset = 50,
      scrollOffset = (framesCount * baseScrollOffset) / speed,
      baseThreshold = 10,
      threshold = speed ? baseThreshold / speed : (360 / framesCount) * 2

    let frames = [],
      currentFrameIndex = 0,
      dragging = false,
      previousX = 0

    const loadFrames = () => {
      return new Promise(resolve => {
        let imagesLoadedCount = 0

        for (let i = 1; i <= framesCount; ++i) {
          const img = new Image()
          img.src = `${modelPath}${i}.png`
          img.onload = () => {
            frames.push(img)
            if (++imagesLoadedCount === framesCount) resolve()
          }
        }
      })
    }

    const drawCurrentFrame = () => {
      if (!frames[currentFrameIndex]) return

      sequenceCtx.save()
      sequenceCtx.drawImage(frames[currentFrameIndex], 0, 0, sequence.width, sequence.height)
      sequenceCtx.restore()
    }

    const draw = () => {
      sequenceCtx.clearRect(0, 0, sequence.width, sequence.height)
      drawCurrentFrame()
    }

    const changeFrame = delta => {
      currentFrameIndex = (currentFrameIndex + delta + framesCount) % framesCount
      draw()
    }

    const onStartGrab = e => {
      dragging = true
      previousX = e.clientX || e.touches[0].clientX
      document.body.style.cursor = 'grabbing'
      sequence.style.cursor = 'grabbing'
    }

    const onEndGrab = e => {
      dragging = false
      document.body.style.cursor = 'auto'
      sequence.style.cursor = 'grab'
    }

    const onGrabbing = e => {
      if (dragging) {
        const clientX = e.clientX || e.touches[0].clientX,
          deltaX = clientX - previousX

        if (deltaX >= threshold) {
          changeFrame(-1)
          previousX = clientX
        } else if (deltaX <= -threshold) {
          changeFrame(1)
          previousX = clientX
        }
      }
    }

    const onScroll = progress => {
      currentFrameIndex =
        Math.ceil(progress * framesCount) <= framesCount - 1
          ? Math.ceil(progress * framesCount)
          : framesCount - 1
      draw()
    }

    const startLoading = () => {
      console.log('loading...')
    }

    const stopLoading = () => {
      console.log('loaded')
      sequence.dataset.sequenceLoaded = 'true'
    }

    const grabInit = () => {
      sequence.addEventListener('mousedown', onStartGrab)
      sequence.addEventListener('touchstart', onStartGrab)

      window.addEventListener('mouseup', onEndGrab)
      window.addEventListener('touchend', onEndGrab)
      window.addEventListener('touchcancel', onEndGrab)

      window.addEventListener('mousemove', onGrabbing)
      window.addEventListener('touchmove', onGrabbing)
    }

    const scrollInit = () => {
      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        trigger: sequence,
        start: 'bottom bottom',
        end: `bottom top-=${scrollOffset}`,
        stagger: 1,
        onUpdate: self => {
          onScroll(self.progress.toFixed(3))
        },
        pin: true,
        scrub: true
      })
    }

    const init = () => {
      draw()

      switch (trigger) {
        case 'scroll':
          scrollInit()
          break

        case 'grab':
          grabInit()
          break
      }
    }

    window.addEventListener('load', () => {
      startLoading()

      loadFrames().then(() => {
        setTimeout(() => {
          stopLoading()
          init()
        }, 2000)
      })
    })
  })
}

export { sequence }
