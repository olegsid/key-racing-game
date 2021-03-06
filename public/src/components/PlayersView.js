import View from './view'

export default class PlayersView extends View {
  constructor () {
    super()
    this.init()
  }

  init () {
    this.element = this.createElement({ tagName: 'div', className: 'players-view' })
    this.list = this.createElement({ tagName: 'ul', className: 'players-list' })
    this.element.append(this.list)
    this.hide()
  }

  render (players) {
    this.show()
    this.elements = players.map(player => {
      const element = this.createElement({ tagName: 'li', className: 'player' })
      const name = this.createElement({ tagName: 'span', className: 'player__name' })
      const score = this.createElement({ tagName: 'span', className: 'player__score' })
      name.innerHTML = player.name
      score.innerHTML = player.score

      element.append(name, score)
      return element
    })

    if (this.list.childNodes.length > 0) {
      const newNode = this.createElement({ tagName: 'ul', className: 'players-list' })
      
      newNode.append(...this.elements)
      this.element.replaceChild(newNode, this.list)
      this.list = newNode
    } else {
      this.list.append(...this.elements)
    }
  }
}
