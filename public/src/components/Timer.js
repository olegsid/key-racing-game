import View from './view'
import moment from 'moment'

export default class Timer extends View {
  constructor () {
    super()
    this.init()
  }

  init () {
    this.element = this.createElement({ className: 'timer' })
    this.hide()
  }

  start (time) {
    this.show()
    const interval = 1000
    let timeLeft = time

    const timer = setInterval(() => {
      timeLeft -= interval
      if (timeLeft > 0) {
        const splittedTime = moment(timeLeft).format('m s').split(' ')
        const customFormatedTime =`${splittedTime[0]}m ${splittedTime[1]}s`
        
        this.element.innerHTML = `${customFormatedTime}<br> until the end`
      } else {
        this.element.innerHTML = `no time left`
        clearInterval(timer)
      }
    }, interval)
  }
}
