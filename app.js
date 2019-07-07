const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')

const indexRouter = require('./routes/index')
const login = require('./routes/login')
const game = require('./routes/game')

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
app.use('/game', /* passport.authenticate('jwt'), */ game)

app.get('/chat', passport.authenticate('jwt'), function (req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'))
})

/** game engine TODO MOVE to some file */

Game.onStartHandler(({ room, startDate }) => {
  io.to(room).emit('start', { users, startDate, duration: Game.duration })
})

Game.onEndHandler(({ room, startDate }) => {
  io.to(room).emit('end', "thats all" )
})


io.on('connection', socket => {
  socket.on('join', ({ token }) => {
    const userLogin = jwt.decode(token).login
    const user = { name: userLogin, isActive: true, id: socket.id }
    
    const room = Game.join(user) 
    socket.join(room)
    Game.willStart()
  })

  socket.on('disconnect', () => {
    Game.disconnectUser(socket.id)
  })

  socket.on('submitMessage', payload => {
    const userLogin = jwt.decode(token).login
    socket.broadcast.emit('newMessage', { message, user: userLogin })
    socket.emit('newMessage', { message, user: userLogin })
  })

  // socket.emit('game end', { results})

  // socket.emit('game start')
})

module.exports = app
server.listen(4200)
