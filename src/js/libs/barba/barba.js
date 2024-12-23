import barba from '@barba/core'

import { commonFunction } from '../..'
import { disableScroll, enableScroll } from '../../utils/scroll'
import { destroyLenis } from '../lenis/lenis'

const transitionScreenID = 'transition-screen'
const transitionScreenActiveClass = '--active'
// FRONT: Время задержки экрана перехода между страницами (когда оч быстрый переход и анимация не отыгрывает) (в мс)
const transitionScreenDelay = 1000

// FRONT: Если очень быстрая прогрузка страницы и анимация не успевает проигрывать делаем задержку
const afterTransition = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      document.querySelector(transitionScreenID)?.classList.remove(transitionScreenActiveClass)
      resolve()
    }, transitionScreenDelay)
  })
}

export const barbaUi = () => {
  if (barba.initialized) return // Проверка, чтобы избежать повторной инициализации

  // FRONT: Сброс скролла после завершения анимации перехода
  barba.hooks.afterLeave(() => {})
  barba.hooks.beforeLeave(() => {
    destroyLenis()
  })

  // FRONT:  //BACK: при загрузке новой страницы все функции перезапускаются
  // barba.hooks.afterEnter(() => {
  // });

  barba.hooks.afterEnter(data => {
    commonFunction() // Вызов функции при переходе между страницами
    setTimeout(() => {
      enableScroll() // Восстановление скролла на странице
      window.scrollTo(0, 0)
    }, transitionScreenDelay)
  })

  // BACK: если нам нужно программно перенаправить на страницу без анимаций (по дефолту) (все равно что изменить location.href)
  // barba.force(href: string)

  const urlParameters = new URLSearchParams(window.location.search)
  if (urlParameters.has('test')) {
    // в GET-параметре есть значение test
    if (barba) {
      // Barba.js инициализирован
      barba.destroy()
    }
  } else {
    // в GET-параметре нет значения test
    // инициализация Barba.js

    barba.init({
      // BACK: По умолчанию мы кешируем страницы, если нужно добавить игнор
      // cacheIgnore: ['/contact/', '/:category/post?'],

      // BACK: по умолчанию включена предзагрузка стр при наведении на ссылку мышью, для игнора прописываем тут
      // prefetchIgnore: '/home/'

      preventRunning: true,

      // BACK: при получении конкретной ошибки перекидываем на нашу стр 404
      // requestError: (trigger, action, url, response) => {
      //   if (action === 'click' && response.status && response.status === 404) {
      //     barba.go('/404');
      //   }
      //   return false;
      // },

      // hooks: {
      //   afterEnter(data) {
      //     console.info(234);
      //     onloadCallback();
      //   },
      // },

      // FRONT: отображение доп информации для отладки
      debug: true,

      // FRONT: включаем эту настройку, если у нас переходящий экран не закрывает все пространство и пользователь может кликнуть во время загрузки другую ссылку Эта настройка предотвратит загрузку
      // preventRunning: true,

      // FRONT: роутинг по страницам, namespace соответствует названию страницы
      views: [
        {
          namespace: 'home',

          // FRONT:сюда вставляем функции которые нужны конкретно для этой страницы, всегда нужно вставлять те функции которые что-то переинициализируют, высчитывают скролл и т.д.
          afterEnter() {},

          // FRONT: при выходе со стр убираем

          beforeLeave() {}
        }
      ],

      // FRONT: Анимация перехода
      // Массив, в него можно добавлять несколько кастомных транзишенов
      transitions: [
        {
          name: 'default-transitions',

          leave(data) {
            document.querySelector(transitionScreenID)?.classList.add(transitionScreenActiveClass)
          },

          afterEnter(data) {
            return afterTransition()
          }
        }
        // FRONT: Анимация которая сработает при переходе с определенной страницы на другую определенную страницу

        // {
        //   name: 'main-to-about', // специальная анимация для перехода между "main" и "about"
        //   from: 'main',
        //   to: 'about',
        //   leave(data) {
        //     // анимация при уходе со страницы main
        //   },
        //   enter(data) {
        //     // анимация при входе на страницу about
        //   },
        // },
      ]
    })
  }

  barba.initialized = true // Флаг, чтобы предотвратить повторную инициализацию
}
