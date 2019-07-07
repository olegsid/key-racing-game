import './styles/index.scss'
import { authentication, isAuthentified } from './api/auth'

const redirectToGamePage = () => location.replace('/game')

const onload = () => isAuthentified() && redirectToGamePage()

const login = () => {
  const login = document.getElementById('login')
  const password = document.getElementById('password')

  return event => {
    event.preventDefault()

    authentication(login.value, password.value)
      .then(redirectToGamePage)
      .catch(err => console.log(err))
  }
}

const loginBtn = document.getElementById('logIn')

loginBtn.addEventListener('click', login())
window.onload = onload
