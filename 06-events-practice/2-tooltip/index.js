class Tooltip {
  static _instance = new this();
  element;

  constructor() {
    return this.constructor._instance;
  }

  initialize () {
      this.body = document.body
      this.body.addEventListener('mouseover', this.mouseOver.bind(this))
      this.body.addEventListener('mouseout', this.mouseOut.bind(this))

      this.element = this.render()
      document.body.append(this.element);
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
      this.element.innerText = event.target.dataset.tooltip
      this.element.style.left =  event.pageX + 'px'
      this.element.style.top =  event.pageY + 'px'
    }
  }

  render(txt= 'bar-bar-bar'){
    const tooltipElem = document.createElement('div');
    tooltipElem.innerHTML = `<div class="tooltip">${txt}</div>`;
    tooltipElem.firstElementChild.style.left = '-500px'
    return tooltipElem.firstElementChild
  }

  remove(){
    const tt = document.querySelector('.tooltip')
    if (tt){
      tt.remove()
    }
  }

  destroy(){
    this.remove();
    this.body.removeEventListener('mouseover', this.mouseOver)
    this.body.removeEventListener('mouseout', this.mouseOut)
  }

}

export default Tooltip;
