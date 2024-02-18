export default class DoubleSlider {
  element;
  subElements = {};
  sliderRect;

  constructor({
    min = 100,
    max = 200,
    formatValue = (value => '$' + value),
    selected = {}
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.from = selected.from || this.min;
    this.to = selected.to || this.max;

    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createEventListeners();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return (`
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="scale" class="range-slider__progress" style="left: ${this.toPercent(this.from)}%; right: ${this.toPercent(this.to, 'to')}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${this.toPercent(this.from)}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${this.toPercent(this.to, 'to')}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.to)}</span>
      </div>
    `);
  }

  toPercent = (value, current = 'from') => {
    const total = this.max - this.min;
    if (current === 'from') {
      return ((this.from - this.min) / total) * 100;
    }
    return ((this.max - this.to) / total) * 100;
  }

  toValue = (percent) => {
    const total = this.max - this.min;
    return this.min + (total * percent) / 100;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createEventListeners() {
    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  destroyEventListeners() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  getSliderRect() {
    if (!this.sliderRect) {
      this.sliderRect = this.subElements.inner.getBoundingClientRect();
    }
  }

  handleDocumentPointerDown = (e) => {
    this.getSliderRect();

    if (e.target === this.subElements.thumbLeft) {
      this.currentThumb = 'left';
      e.target.style.cursor = 'grabbing';
      document.addEventListener('pointermove', this.handleDocumentPointerMove);
      document.addEventListener('pointerup', this.handleDocumentPointerUp);
    }

    if (e.target === this.subElements.thumbRight) {
      this.currentThumb = 'right';
      e.target.style.cursor = 'grabbing';
      document.addEventListener('pointermove', this.handleDocumentPointerMove);
      document.addEventListener('pointerup', this.handleDocumentPointerUp);
    }
  }

  toPX(value) {
    const total = this.max - this.min;
    return (((value - this.min) / total) * this.sliderRect.width) + this.sliderRect.left;
  }

  handleDocumentPointerMove = (e) => {

    if (this.currentThumb === 'right') {
      const normalizeClickXRight = Math.min(this.sliderRect.right, Math.max(this.toPX(this.from) || this.sliderRect.left, e.clientX));
      const percentXRight = (this.sliderRect.right - normalizeClickXRight) / this.sliderRect.width * 100;

      this.to = this.toValue(Math.round(100 - percentXRight));
      this.subElements.to.textContent = this.formatValue(this.to);
      this.subElements.scale.style.right = `${percentXRight}%`;
      this.subElements.thumbRight.style.right = `${percentXRight}%`;
    }

    if (this.currentThumb === 'left') {
      const normalizeClickXLeft = Math.min(this.toPX(this.to) || this.sliderRect.right, Math.max(this.sliderRect.left, e.clientX));
      const percentXLeft = (normalizeClickXLeft - this.sliderRect.left) / this.sliderRect.width * 100;

      this.from = this.toValue(Math.round(percentXLeft));
      this.subElements.from.textContent = this.formatValue(this.from);
      this.subElements.scale.style.left = `${percentXLeft}%`;
      this.subElements.thumbLeft.style.left = `${percentXLeft}%`;
    }
  }

  handleDocumentPointerUp = (e) => {
    this.dispatchEvent();
    e.target.style.cursor = 'grab';
    document.removeEventListener('pointermove', this.handleDocumentPointerMove);
    document.removeEventListener('pointerup', this.handleDocumentPointerUp);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
  }

  dispatchEvent = () => {
    this.element.dispatchEvent(new CustomEvent('range-select', {
      bubles: true,
      detail: {from: this.from, to: this.to},
    }));
  }
}
