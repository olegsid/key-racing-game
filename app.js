const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const indexRouter = require('./routes/index')
const login = require('./routes/login')
const game = require('./routes/game')
const text = require('./routes/text')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const Game = require('./services/Game')

require('./config/passport.js')

app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/login', login)
app.use('/game', game)
app.use('/text', text)

Game.onJoinHandler(game => {
  io.to(Game.nextGame.room).emit('joined', { game, duration: Game.duration })
})

Game.onStartHandler(game => {
  io.to(Game.nextGame.room).emit('start', { game, duration: Game.duration })
})

Game.onEndHandler((game, winner) => {
  console.log('ended')
  io.to(Game.currentGame.room).emit('endGame', { game, winner })
})

io.on('connection', socket => {
  socket.on('join', ({ token }) => {
    const userLogin = jwt.decode(token).login
    const user = {
      name: userLogin,
      isActive: true,
      id: socket.id,
      score: 0,
      finishTime: 0
    }
    const room = Game.join(user)

    socket.join(room)
    Game.willStart()
  })

  socket.on('disconnect', () => {
    try {
      console.log('disconnect')
      Game.disconnectUser(socket.id)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('submit', payload => {
    const index = Game.currentGame.users.findIndex(user => user.id === socket.id)
    Game.currentGame.users[index].score = payload.score

    io.to(Game.currentGame.room).emit('updateScore', { game: Game.currentGame })
  })


})

server.listen(3001)
module.exports = app
