class Tooltip {
  static instance;

  static OFFSET_X = 10;
  static OFFSET_Y = 10;

  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize () {
    this.createEventListeners();
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return (
        `<div class="tooltip"></div>`
    );
  }

  hanldeDocumentPointerOver = (event) => {
    if (!event.target.dataset.tooltip) {
      return;
    }

    this.render(event.target.dataset.tooltip);
  }

  hanldeDocumentPointerMove = (event) => {
    if (!event.target.dataset.tooltip) {
      return;
    }

    this.element.style.left = event.pageX + Tooltip.OFFSET_X + 'px';
    this.element.style.top = event.pageY + Tooltip.OFFSET_Y + 'px';
  }

  hanldeDocumentPointerOut = (event) => {
    if (!event.target.dataset.tooltip) {
      return;
    }

    this.remove();
  }

  render(content) {
    this.element.textContent = content;
    document.body.append(this.element);
  }

  createEventListeners() {
    document.body.addEventListener('pointerover', this.hanldeDocumentPointerOver);
    document.body.addEventListener('pointermove', this.hanldeDocumentPointerMove);
    document.body.addEventListener('pointerout', this.hanldeDocumentPointerOut);
  }

  destroyEventListeners() {
    document.body.removeEventListener('pointerover', this.hanldeDocumentPointerOver);
    document.body.removeEventListener('pointermove', this.hanldeDocumentPointerMove);
    document.body.removeEventListener('pointerout', this.hanldeDocumentPointerOut);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
  }
}

export default Tooltip;
