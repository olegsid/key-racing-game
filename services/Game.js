const { delay } = require('../helpers/utils')
const texts = require('../db/texts.json')
const moment = require('moment')

class Game {
  constructor () {
    this.initGames()
    this.startTimer = null
    this.endTimer = null
    this.delay = 5 * 1000
    this.duration = 20 * 1000
  }

  initGames () {
    this.currentGame = this.generateNewGame()
    this.nextGame = this.generateNewGame()
  }

  join (user) {
    this.nextGame.users.push(user)
    return this.nextGame.room
  }

  disconnectUser (id) {
    const currentGameUser = this.currentGame.users.find(user => user.id == id)
    if (currentGameUser) {
      currentGameUser.isActive = false
    } else {
      const nextGameUserIndex = this.nextGame.users.findIndex(user => user.id == id)

      this.nextGame.users.splice(nextGameUserIndex, 1)
      if (this.nextGame.users.length === 0) {
        clearTimeout(this.startTimer)
        this.startTimer = null
        this.nextGame = this.generateNewGame()
      }
    }
  }

  async willStart () {
    console.log('isTimer', !!this.startTimer)
    if (!this.startTimer) {
      this.nextGame.startDate = new Date(Date.now() + this.delay)
      this.joinHandler(this.nextGame)

      await delay(this, 'startTimer', this.delay)
      this.startHandler(this.nextGame)
      this.prepareNextGame()

      await delay(this, 'endTimer', this.duration)
      this.endHandler(this.currentGame)
    } else {
      this.joinHandler(this.nextGame)
    }
  }

  prepareNextGame () {
    this.currentGame = this.nextGame
    this.nextGame = this.generateNewGame()
  }

  onStartHandler (handler) {
    this.startHandler = handler
  }

  onJoinHandler (handler) {
    this.joinHandler = handler
  }

  onEndHandler (handler) {
    this.endHandler = handler
  }

  generateNewGame () {
    const newGame = {
      startDate: '',
      room: 'room' + Math.random(),
      users: [],
      textId: Math.round(Math.random() * (texts.length - 1))
    }
    return newGame
  }
}

module.exports = new Game()
