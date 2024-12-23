import placemarkIco from '../../images/black-square.svg'

// settings

// настройка иконки и ее расположения
const icon = placemarkIco
const size = [32, 32]
const offset = [-16, -16]

// шаблон для контента внутри кластера
const templateContents =
  '<div style="color: #FFF; font-size: 16px; line-height: 150%; text-align: center; padding-block: 4px;">{{ properties.geoObjects.length }}</div>'

export function mapCluster({ markArr, map }) {
  const clusterer = new ymaps.Clusterer({
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false,

    clusterIcons: [
      {
        href: icon,
        size,
        offset
      }
    ],

    clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(templateContents)
  })

  clusterer.options.set({
    gridSize: 80,
    clusterDisableClickZoom: false,
    center: true
  })

  clusterer.add(markArr)

  map.geoObjects.add(clusterer)
  map.setBounds(clusterer.getBounds(), {
    checkZoomRange: true
  })
  return clusterer
}
