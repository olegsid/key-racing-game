import './styles/game.scss'
import { isAuthentified } from './api/auth'
import GameView from './components/GameView'


const redirectToHomePage = () => location.replace('/')

const startApp = () => {
  if (!isAuthentified()) {
    redirectToHomePage()
  } else {
    const gameApp = new GameView('#app');
  }
}

window.onload = startApp
