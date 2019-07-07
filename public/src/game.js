import './styles/game.scss'
import { isAuthentified } from './api/auth'
import io from 'socket.io-client'

const socket = io('http://localhost:4200')

const redirectToHomePage = () => location.replace('/')

const onload = () => {
  if (!isAuthentified()) {
    redirectToHomePage()
  } else {
    const jwt = localStorage.getItem('jwt')

    socket.emit('join', {
      token: jwt
    })
  }
}

window.onload = onload
