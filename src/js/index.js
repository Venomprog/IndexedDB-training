// common imports

import '../styles/style.scss'
import { formTablePageInit } from './components/IndexDB-1'
import { secondTaskInit } from './components/IndexDB-2'


export const commonFunction = () => {
  
  formTablePageInit()

}


window.addEventListener('load', () => {
  commonFunction()
  secondTaskInit()
})