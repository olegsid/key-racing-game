import View from './view'
import { inherits } from 'util'

export default class Button extends View {
  constructor () {
    super()
    this.init()
  }
  init () {
    this.element = this.createElement({ tagName: 'input', className: 'button', attributes: { type:'button', value: 'Restart' } })
    this.hide()
  }
  
  onClick(onClick){
    this.element.addEventListener('click', onClick)
  }
}
