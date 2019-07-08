const { delay } = require('../helpers/utils')
const texts = require('../db/texts.json')

class Game {
  constructor () {
    this.initGames()
    this.startTimer = null
    this.endTimer = null
    this.delay = 15 * 1000
    this.duration = 61 * 1000
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
      if (this.currentGameUser.users.length === 0) {
        this.endHandler(this.currentGame)
      }
    } else {
      const nextGameUserIndex = this.nextGame.users.findIndex(user => user.id == id)
      if (~nextGameUserIndex) {
        this.removeUserFromNextGame(nextGameUserIndex)
      }
    }
  }

  removeUserFromNextGame (nextGameUserIndex) {
    this.nextGame.users.splice(nextGameUserIndex, 1)
    if (this.nextGame.users.length === 0) {
      clearTimeout(this.startTimer)
      this.startTimer = null
      this.nextGame = this.generateNewGame()
    }
  }

  async willStart () {
    // console.log('isTimer', !!this.startTimer)
    if (this.isFirstUserInNextGame) {
      const calculatedDelay = this.isCurrentGameStarted
        ? this.delay + (Date.parse(this.currentGame.startDate) + this.duration - Date.now())
        : this.delay
      console.log(calculatedDelay)

      this.nextGame.startDate = new Date(Date.now() + calculatedDelay)
      this.joinHandler(this.nextGame)

      await delay(this, 'startTimer', calculatedDelay)
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
    this.endHandler = game => {
      game.users.sort((a, b) => {
        return a.score - b.score
      })
      clearTimeout(this.endTimer)
      const winner = game.users[0].name
      handler(game, winner)
    }
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

  get isFirstUserInNextGame () {
    return this.nextGame.users.length == 1
  }

  get isCurrentGameStarted () {
    return this.currentGame.users.length > 0
  }
}

module.exports = new Game()
