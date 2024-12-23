// функция создания балуна
export function createBalloon(title, address, link) {
  const balloon = document.createElement('div')
  balloon.classList.add('balloon')

  balloon.innerHTML = `
  <p class="balloon__title text-20">${title}</p>
  <p class="balloon__address text-16 text-grey">${address}</p>
  <a class="balloon__link link" href="https://${link}">
  <span class='link__text text-16'>${link}</span></a>
  `

  return balloon
}
