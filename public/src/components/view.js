class View {
  constructor(){
    this.element = ''
  }

  createElement({ tagName='div', className = '', attributes = {} }) {
    const element = document.createElement(tagName);
    element.classList.add(className.trim());
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    return element;
  }

  show(){
    this.element.style.display =''
  }

  hide(){
    this.element.style.display = 'none'
  }
}

export default View;
