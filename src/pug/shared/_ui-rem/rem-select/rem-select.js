const remSelect = () => {
  const selects = document.querySelectorAll('.select')
  if (selects.length === 0) return

  selects.forEach(select => {
    select.addEventListener('click', function () {
      selects.forEach(s => {
        if (s !== this) {
          s.classList.remove('--active')
        }
      })
      this.classList.toggle('--active')
    })

    const listItems = select.querySelectorAll('.select__list li p')
    listItems.forEach(item => {
      item.addEventListener('click', function (e) {
        e.stopPropagation() // блокируем всплытие события
        const input = this.closest('.select').querySelector('input')
        const text = this.textContent
        input.value = text // устанавливаем значение
        this.closest('.select').classList.remove('--active')
      })
    })
  })

  // Отслеживаем клики вне списка и закрываем список, если он открыт
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.select')) {
      selects.forEach(select => {
        select.classList.remove('--active')
      })
    }
  })
}

remSelect()

export { remSelect }
