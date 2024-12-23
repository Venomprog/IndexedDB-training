// common imports

import '../styles/style.scss'
import { formTablePageInit } from './components/IndexDB-1'


export const commonFunction = () => {
  
  formTablePageInit()

}


window.addEventListener('load', commonFunction)