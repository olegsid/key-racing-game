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
    this.show()
    this.element.innerHTML = `The game will start in ${startDelay} seconds`
  }
  showWinnerMessage(name){
    this.show()
    this.element.innerHTML = `Player ${name} won the race`
  }


}

export default Info
