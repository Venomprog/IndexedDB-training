import Swiper from 'swiper/bundle'

// что нового:
// 1. переписано с jq на ванильку
// 2. уничтожение имеющихся свайперов перед инициализацией новых - для барбы
// 3. создание свайпера по атрибут-значение
// 4. кнопки некст, прев, пагинация, тамбсы - из любого места в документе по соответствующему атрибуту-значению - при их наличии, автоматическая привязка их к текущему свайперу. нужно только добавить соответствующую верстку/элемент и прокинуть на нее соответствующую пару атрибут-значение

// атрибуты:
// [data-slider-id = myId] - слайдер, атрибут вешается на .swiper
// [data-slider-prev = myId], [data-slider-next= myId] - кнопки prev, next
// [data-slider-pagination = myId] - блок, куда будет создана пагинация
// [data-slider-thumbs = myId] - слайдер, который будет тамбсами. нужна соответствующая верстка, атрибут вешается на .swiper

const BREAKPOINT = 1200

let mySwipers = []

export function swiperInit() {
  if (mySwipers.length) {
    mySwipers.forEach(mySwiper => {
      mySwiper.destroy(true, true)
    })
    mySwipers = []
  }

  const sliders = document.querySelectorAll('[data-slider-id]')

  console.log('swiperInit', sliders) // для кнтроля в барбе

  if (sliders.length) {
    sliders.forEach(slider => {
      const slider_el = slider
      const slider_id = slider_el.getAttribute('data-slider-id')
      const slider_prevBtn = document.querySelector(`[data-slider-prev=${slider_id}]`)
      const slider_nextBtn = document.querySelector(`[data-slider-next=${slider_id}]`)
      const slider_pagination = document.querySelector(`[data-slider-pagination=${slider_id}]`)
      const slider_thumbs_el = document.querySelector(`[data-slider-thumbs=${slider_id}]`)

      let slider_thumbs

      if (slider_thumbs_el) {
        slider_thumbs = new Swiper(slider_thumbs_el, {
          freeMode: true,
          slidesPerView: 7,

          on: {
            init: function () {
              mySwipers.push(this)
            }
          }
        })
      }

      new Swiper(slider_el, {
        slidesPerView: 1,
        spaceBetween: 12,
        loop: false,
        speed: 500,
        watchSlidesProgress: true,

        navigation: {
          nextEl: slider_nextBtn || null,
          prevEl: slider_prevBtn || null
        },

        ...(slider_pagination && {
          pagination: {
            el: slider_pagination,
            clickable: true
          }
        }),

        ...(slider_thumbs_el &&
          slider_thumbs && {
            thumbs: {
              swiper: slider_thumbs
            }
          }),

        on: {
          init: function () {
            mySwipers.push(this)

            // актуальная версия свайпера делает это сама из коробки
            // if (this.slides.length === this.visibleSlides.length) {
            //     slider_prevBtn?.style.display = 'none'
            //     slider_nextBtn?.style.display = 'none'
            // }
          }
        }
      })
    })
  }
}
