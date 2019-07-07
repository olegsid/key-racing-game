import { getText } from './../api/auth'
import io from 'socket.io-client'
import KeyRace from './KeyRace'
import moment from 'moment'
import View from './view'
import Info from './Info'
import PlayersView from './PlayersView'
import Timer from './Timer'
import Button from './Button'

export default class GameView extends View {
  constructor (root) {
    super()
    this.init(root)
    const socket = io('http://localhost:3001')
    this.initSocketHandlers(socket)
  }

  init (root) {
    this.element = this.createElement({ className: 'game-view' })

    this.info = new Info()
    this.keyRace = new KeyRace()
    this.playersView = new PlayersView()
    this.timer = new Timer()
    this.button = new Button()

    this.element.append(
      this.playersView.element,
      this.info.element,
      this.keyRace.element,
      this.timer.element,
      this.button.element
    )

    document.querySelector(root).appendChild(this.element)
  }

  initSocketHandlers (socket) {
    const jwt = localStorage.getItem('jwt')

    socket.emit('join', {
      token: jwt
    })

    socket.on('joined', async payload => {
      console.log(payload.game.room)
      const currentDate = moment(new Date())
      const startDate = moment(payload.game.startDate)
      const delay = startDate.diff(currentDate, 'seconds')

      this.info.showStartMessage(delay)
      const response = await getText(payload.game.textId)
      const data = await response.json()
      this.keyRace.initModel(data.text)
    })

    socket.on('start', payload => {
      const users = payload.game.users
      console.log(users)
      const duration = payload.duration

      this.info.hide()
      this.keyRace.start()
      this.playersView.render(users)
      this.timer.start(duration)
    })

    this.keyRace.onSubmit(() => {
      socket.emit('submit', {
        score: this.keyRace.entered.length,
        token: jwt
      })
    })

    socket.on('updateScore', ({ game: { users } }) => {
      this.playersView.render(users)
    })

    socket.on('endGame', ({ game, winner }) => {
      this.keyRace.hide()
      this.timer.hide()
      this.keyRace.isStarted = false
      this.info.showWinnerMessage(winner)
      this.button.show()
      socket.disconnect()
    })

    this.button.onClick(() => {
      location.reload()
    })

    socket.on('disconnect', () => {
      socket.open()
      // socket.emit('join', {
      //   token: jwt
      // })
    })
  }
}
