class Tooltip {
  static _instance = new this();
  element;

  constructor() {
    return this.constructor._instance;
  }

  initialize () {
    this.body = document.body
    this.createEventListeners()
    this.render()
  }

  mouseOut(event) {
    this.remove()
    // this.element.hidden = true
  }

  mouseOver(event) {
    if (!document.querySelector('.tooltip')){
      document.body.append(this.element);
    }
    // this.element.hidden = false

    if (this.element){
      this.tooltipPosition(this.element, event)
    }
  }

  tooltipPosition(elem, event){
    elem.innerText = event.target.dataset.tooltip
    elem.style.left =  event.pageX + 'px'
    elem.style.top =  event.pageY + 'px'
  }

  render(txt = 'bar-bar-bar'){
    this.element = this.createElement(txt)
    this.body.append(this.element);
  }

  createElement(txt) {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate(txt);
    element.firstElementChild.style.left = '-500px'
    // tooltipElem.firstElementChild.hidden = true
    return element.firstElementChild;
  }

  createTemplate(txt) {
    return (`<div class="tooltip">${txt}</div>`)
  }

  createEventListeners() {
    this.body.addEventListener('mouseover', this.mouseOver.bind(this))
    this.body.addEventListener('mouseout', this.mouseOut.bind(this))
  }

  destroyEventListeners() {
    this.body.removeEventListener('mouseover', this.mouseOver)
    this.body.removeEventListener('mouseout', this.mouseOut)
  }

  remove(){
    const tt = document.querySelector('.tooltip')
    if (tt){
      tt.remove()
    }
  }

  destroy(){
    this.remove();
    this.destroyEventListeners()
  }

}

export default Tooltip;
