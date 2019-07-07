import View from './view'

export default class KeyRace extends View {
  constructor (text) {
    super()
    this.initDOM()
    this.attachEventListeners()
    this.hide()
  }

  initModel (text) {
    this.isStarted = true
    const normalizedText = text.split('')
    this.entered = []
    this.current = normalizedText.shift()
    this.rest = normalizedText
  }
  start () {
    this.renderTextData()
    this.show()
  }
  stop () {
    this.isStarted = false
    this.hide()
  }

  initDOM () {
    this.element = this.createElement({ className: 'key__race-container' })
    this.enteredCharsEl = this.createElement({ tagName: 'span', className: 'key__entered' })
    this.currentCharEl = this.createElement({ tagName: 'span', className: 'key__current' })
    this.restCharsEl = this.createElement({ tagName: 'span', className: 'key__rest' })

    this.element.appendChild(this.enteredCharsEl)
    this.element.appendChild(this.currentCharEl)
    this.element.appendChild(this.restCharsEl)
  }

  renderTextData () {
    this.enteredCharsEl.innerHTML = this.entered.join('')
    this.currentCharEl.innerHTML = this.current || ''
    this.restCharsEl.innerHTML = this.rest.join('')
  }

  attachEventListeners () {
    document.addEventListener('keydown', ({ key }) => {
      if (this.isStarted && key === this.current) {
        this.entered.push(this.current)
        this.current = this.rest.shift()
        this.submitHandler()
        this.renderTextData()
        if (this.current === undefined) {
          console.log('stop')
          this.stop()
        }
      }
    })
  }
  onEnd (handler) {
    this.endHandler = handler
  }

  onSubmit (handler) {
    this.submitHandler = handler
  }
}
