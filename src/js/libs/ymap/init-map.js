import placemarkIco from '../../images/placemark-flag.svg'
import { createBalloon } from './map-balloon'
import { mapCluster } from './map-cluster'

// включить использование баллунов
const withBalloon = true

// настройки метки
const iconImageSize = [32, 32]
const iconImageOffset = [-16, -16]
const icon = placemarkIco

const initMap = () => {
  const markArray = []
  const placemarks = [] // создаем пустой массив точек карты
  const pointsArray = []
  const mapDOM = document.querySelector('#map')

  let center, zoom

  if (!mapDOM) return
  mapDOM.innerHTML = ''

  ymaps.ready(init)

  function init() {
    if (window.myMap) {
      return // если карта уже сущетсвует, то выходим из функции
    }

    if (mapDOM.hasAttribute('map-center')) {
      center = mapDOM.getAttribute('map-center').split(' ')
    }

    if (mapDOM.hasAttribute('map-zoom')) {
      zoom = Number(mapDOM.getAttribute('map-zoom'))
    }

    const myMap = new ymaps.Map('map', {
      center: center || [54.193_122, 37.617_348],
      zoom: zoom || 4,
      controls: ['smallMapDefaultSet']
    })

    // проходимся по всем элементам, которые будут отображены на карте
    const coordsList = document.querySelectorAll('.buy-card__item')

    if (coordsList.length === 0) return

    coordsList.forEach((item, index) => {
      const coordX = item.getAttribute('data-coord-x')
      const coordY = item.getAttribute('data-coord-y')
      const coords = [Number.parseFloat(coordX), Number.parseFloat(coordY)]
      let balloon
      let title
      let address
      let link

      pointsArray.push(coords)

      if (withBalloon) {
        title = item.querySelector('.buy-card__title').textContent
        address = item.querySelector('.buy-card__address').textContent
        link = item.querySelector('.buy-card__link').textContent

        balloon = createBalloon(title, address, link)
      }

      placemarks.push({
        coords,
        hint: title,
        balloon: withBalloon ? balloon.innerHTML : undefined
      })
    })

    // создание плейсмарок (точек на карте)
    placemarks.forEach(placemark => {
      const myPlacemark = new ymaps.Placemark(
        placemark.coords,
        {
          hintContent: placemark.hint,
          balloonContent: withBalloon ? placemark.balloon : undefined
        },
        {
          iconLayout: 'default#image',
          iconImageHref: icon,
          iconImageSize,
          iconImageOffset
        }
      )

      markArray.push(myPlacemark)

      myMap.geoObjects.add(myPlacemark)
    })

    const cad = document.querySelectorAll('[data-mark]')

    // событие на открытие баллуна при клике на список адресов слева
    cad.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (withBalloon) {
          markArray.forEach((mark, index_) => {
            if (index === index_) {
              // получаем координаты из списка слева
              const x = item.getAttribute('data-coord-x')
              const y = item.getAttribute('data-coord-y')

              // центрируем карту
              myMap.setCenter([x, y])

              // увеличиваем карту
              myMap.setZoom(12)
              markArray[index].balloon.open()
            } else {
              markArray[index_].balloon.close()
            }
          })
        } else {
          console.log('ошибка')
        }
      })
    })

    // событие на закрытие баллуна при клике на карту
    myMap.events.add('click', () => {
      if (withBalloon && myMap.balloon.isOpen()) {
        myMap.balloon.close()
      }
    })

    // Создание кластеров и добавление на карту
    mapCluster({ markArr: markArray, map: myMap })
  }
}

initMap()

export { initMap }
