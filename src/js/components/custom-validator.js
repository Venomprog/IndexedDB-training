import validator from 'validator'

import { inputmaskInit } from '../libs/inputmask/inputmask'

//Вывод сообщений об ошибке, тут можно добавить свой текст
const errorMessages = {
  required: 'Это поле не может быть пустым',
  email: 'Введите корректный email',
  tel: 'Введите корректный номер телефона',
  number: 'Введите корректное число',
  textOnly: 'Введите корректное имя',
  textCyrillic: 'Только кириллица',
  textEnglish: 'Только инглиш'
}

class InputValidator {
  constructor(input) {
    this.el = input
    this.value = input.value
    this.el.addEventListener('input', () => {
      this.value = this.el.value
    })
    if (input.getAttribute('data-validate') !== 'data-validate')
      this.type = input.getAttribute('data-validate')
    else this.type = input.getAttribute('type')
    this.minlength = input.getAttribute('minlength')
    this.required = input.required
    this.isValid = true
    this.afterSubmit = false
    if (input.dataset.errorContainer) {
      this.errorContainer = document.querySelector(
        `[data-error-container=${input.dataset.errorContainer}]`
      )
      this.errorContainer.classList.add('input-ui__error')
    } else this.errorContainer = input.parentNode.querySelector('[data-error-container]')
  }

  validate() {
    if (!this.afterSubmit) {
      this.afterSubmit = true
      this.el.addEventListener('input', () => {
        this.validate()
      })
    }
    const valid = this.checkValid()
    this.#switchError(this.errorMessage)

    return valid
  }

  checkValid() {
    if (this.value !== '') {
      if (this.#checkMinLength()) {
        const textValue = this.value.replace(/['\s_\-]/g, '')
        const phoneValue = this.value.replace(/\D/g, '')

        switch (
          this.type // Тут добавляем нужную нам валидацию, если строк много то выносим в отдельную функцию
        ) {
          case 'email':
            this.isValid = validator.isEmail(this.value)
            this.errorMessage = errorMessages.email
            break

          case 'text':
            this.isValid = true
            break
          case 'text-only':
            this.isValid =
              validator.isAlpha(myValue, 'ru-RU') || validator.isAlpha(myValue, 'en-US')
            this.errorMessage = errorMessages.textOnly
            break
          case 'text-cyrillic':
            this.isValid = validator.isAlpha(textValue, 'ru-RU')
            this.errorMessage = errorMessages.textCyrillic
            break
          case 'text-english':
            this.isValid = validator.isAlpha(textValue, 'en-EN')
            this.errorMessage = errorMessages.textEnglish
            break
          case 'tel':
            this.errorMessage = errorMessages.tel
            if (phoneValue.length < 11) {
              this.isValid = false
              break
            }
            this.isValid = validator.isMobilePhone(phoneValue)
            break

          default:
            break
        }
      }
    } else if (this.required) {
      this.isValid = false
      this.errorMessage = errorMessages.required //Дефолтное обязательное сообщение
    }
    return this.isValid
  }

  #checkMinLength() {
    if (this.minlength && this.value.length < parseInt(this.minlength)) {
      this.isValid = false
      this.errorMessage = 'Минимальное число символов ' + this.minlength
      return false
    }
    return true
  }

  #switchError(message) {
    if (!this.isValid) {
      this.errorContainer.classList.add('input-ui__error_visible') // Добавить стили для ошибки в соответствии с проектом
      this.errorContainer.innerHTML = message
    } else {
      this.errorContainer.classList.remove('input-ui__error_visible')
      this.errorContainer.innerHTML = ''
    }
  }
}

export const validateFormInit = () => {
  window.isValidFormByElement = isValidFormByElement
  const forms = document.querySelectorAll('form')
  if (!forms) return

  inputmaskInit()

  forms.forEach(form => {
    form.setAttribute('novalidate', '')
    const inputs = form.querySelectorAll('[data-validate]')

    form.addEventListener('submit', e => {
      e.preventDefault()
      let isValidForm = true

      inputs.forEach(input => {
        const inputValidator = new InputValidator(input)

        if (!inputValidator.validate()) isValidForm = false
      })
    })
  })
}

function isValidFormByElement(form) {
  const inputs = form.querySelectorAll('[data-validate]')
  let isValidForm = true
  inputs.forEach(input => {
    const inputValidator = new InputValidator(input)
    if (!inputValidator.checkValid()) isValidForm = false
  })
  return isValidForm
}
