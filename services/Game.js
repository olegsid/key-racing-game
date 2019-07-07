const { delay } = require('../helpers/utils')

class Game {
  constructor () {
    this.init()
    this.startTimer = null
    this.endTimer = null
    this.delay = 15 * 1000
    this.duration = 30 * 1000
  }

  initRoom () {
    this.currentGame = null
    this.nextGame = {
      startDate: '',
      room: 'room' + Math.random(),
      users: []
    }
  }

  join (user) {
    this.nextGame.users.push(user)
    return this.nextGame
  }

  disconnectUser (id) {
    const currentGameUser = this.currentGame.users.find(user => user.id == id)
    if (currentGameUser) {
      currentGameUser.isActive = false
    } else {
      const nextGameUserIndex = this.nextGame.users.findIndex(user => user.id == id)
      this.nextGame.users.splice(nextGameUserIndex, 1)

      if (this.nextGame.users.length === 0) {
        this.startTimer = null
      }
    }
  }

  async willStart () {
    if (!this.startTimer) {
      // this.nextGame.startDate = new Date() + this.delay + this.duration

      await delay(this, 'startTimer', this.delay)
      this.startHandler(this.nextGame)
      this.prepareNextGame()
      await delay(this, 'endTimer', this.duration)
      this.endHandler(this.currentGame)
    }
  }

  prepareNextGame () {
    Object.assign(this.currentGame, this.nextGame)
    this.currentGame.startDate = new Date()
    this.initRoom()
  }

  onStartHandler (handler) {
    if (!this.startHandler) {
      this.startHandler = handler
    }
    // return this.startHandler(this.currentGame)
  }

  onEndHandler (handler) {
    if (!this.endTimer) {
      this.endHandler = handler
    }
    return this.endHandler(this.currentGame)
  }

  // get nextGameTime () {
  //   return this.delay + this.duration
  // }
}

module.exports = new Game()
