import Accordion from 'accordion-js'
import 'accordion-js/dist/accordion.min.css'

const options = {
  duration: 400,
  showMultiple: false,
  elementClass: 'accordion',
  triggerClass: 'accordion__button',
  activeClass: 'active',
  panelClass: 'accordion__panel',

  onOpen: function (currentElement) {
    console.log(currentElement)
  }
}

export const accordion = () => {
  const accordions = [...document.querySelectorAll('.accordion-container')]
  new Accordion(accordions, options)
}
