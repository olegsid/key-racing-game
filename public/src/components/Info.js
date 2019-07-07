import View from './view'

class Info extends View {
  constructor () {
    super()
    this.init()
  }
  init () {
    this.element = this.createElement({ className: 'info-msg' })
  }

  showStartMessage (startDelay) {
    this.element.style.display = ''
    this.element.innerHTML = `The game will start in ${startDelay} seconds`
  }

  hide () {
    this.element.style.display = 'none'
  }
}

export default Info
