import Inputmask from 'inputmask'

// если при срабатывании маски будет ошибка в консоли,
// то помогает поставить другую версию, например, npm install inputmask@next --save

export function inputmaskInit() {
  const myPhoneInputs = document.querySelectorAll('[data-mask-phone]')
  const im = new Inputmask('+7 (999) 999-99-99')

  myPhoneInputs.forEach(myInput => {
    im.mask(myInput)

    myInput.inputmask.option({
      onBeforeMask: function (value, opts) {
        let processedValue = value.replace(/\D/g, '')
        if (processedValue[0] == '7' || processedValue[0] == '8') {
          processedValue = processedValue.slice(1)
        }

        return processedValue
      }
    })
  })
}
