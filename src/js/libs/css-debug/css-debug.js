/**
 * в data-css-debug указываем название класса, который будет добавляться если checked
 *
 *
 * one-child - для одного элемента, отображает лишние обертки вокруг элемента
 *
 * border-all - бордер вокруг каждого элемента, помогает в ситуациях, когда пытаемся определить какой элемент выходит за рамки
 *
 * inline-style - указывает на элемент, у которого есть inline стили,нужно для того, чтобы отловить ошибки, когда стили записаны инлайном, а не в классах
 */
export default function cssDebug(enabled) {
  if (enabled === true) {
    const body = document.querySelector('body')
    const debugElement = `
    <div class="css-debug" data-debug-box>
      <h2>Debug</h2>
      <div class="css-debug__box">
        <label>
          <input type="checkbox" name="name" data-css-debug="one-child">
          <p>one child</p>
        </label>

        <label>
          <input type="checkbox" name="name" data-css-debug="border-all">
          <p>border all</p>
        </label>

        <label>
          <input type="checkbox" name="name" data-css-debug="inline">
          <p>inline style</p>
        </label>

      </div>
    </div>
  `

    // <label>
    //   <input type="checkbox" name="name" data-css-debug="gylis">
    //   <p>Вложенность</p>
    // </label>
    const debugBox = body.querySelector('[data-debug-box]')

    if (!debugBox) {
      body.insertAdjacentHTML('beforeend', debugElement)
    }

    const checkboxes = document.querySelectorAll('[data-css-debug]')
    for (const item of checkboxes) {
      item.addEventListener('change', event => {
        // Снимаем выделение с других чекбоксов и удаляем классы
        for (const checkbox of checkboxes) {
          if (checkbox !== event.target) {
            checkbox.checked = false
            body.classList.remove(`css-debug-${checkbox.getAttribute('data-css-debug')}`)
          }
        }

        const debugClass = `css-debug-${event.target.getAttribute('data-css-debug')}`

        if (event.target.checked) {
          body.classList.add(debugClass)
        } else {
          body.classList.remove(debugClass)
        }
      })
    }
  }
}
