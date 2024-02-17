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
    this.selected = selected;
    this.selected.from = selected.from || this.min;
    this.selected.to = selected.to || this.max;

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
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="scale" class="range-slider__progress" style="left: ${this.toPercent(this.selected.from)}%; right: ${this.toPercent(this.selected.to, 'r')}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${this.toPercent(this.selected.from)}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${this.toPercent(this.selected.to, 'r')}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `);
  }

  toPercent = (value, left = 'left') => {
    const total = this.max - this.min;
    const normalizeValue = Math.min(this.max, Math.max(this.min, value));
    if (left === 'left') {
      this.selected.fromPersent = ((normalizeValue - this.min) / total) * 100;
      return ((normalizeValue - this.min) / total) * 100;
    } else {
      this.selected.toPersent = ((normalizeValue - this.max) * -1 / total) * 100;
      return ((normalizeValue - this.max) * -1 / total) * 100;
    }
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

  handleDocumentPointerDown = (e) => {
    if (!this.sliderRect) {
      this.sliderRect = this.subElements.inner.getBoundingClientRect();
      this.selected.fromPx = this.subElements.thumbLeft.getBoundingClientRect().right;
      this.selected.toPx = this.subElements.thumbRight.getBoundingClientRect().left;
    }

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

  handleDocumentPointerMove = (e) => {
    const normalizeClickX = Math.min(this.sliderRect.right, Math.max(this.sliderRect.left, e.clientX));
    const normalizeClickXLeft = Math.min(this.selected.toPx || this.sliderRect.right, Math.max(this.sliderRect.left, e.clientX));
    const normalizeClickXRight = Math.min(this.sliderRect.right, Math.max(this.selected.fromPx || this.sliderRect.left, e.clientX));
    const sliderWidth = this.sliderRect.width;
    const percentXLeft = (normalizeClickXLeft - this.sliderRect.left) / sliderWidth * 100;
    const percentXRight = -1 * (normalizeClickXRight - this.sliderRect.right) / sliderWidth * 100;
    const percentXRightValue = Math.round((normalizeClickXRight - this.sliderRect.left) / sliderWidth * 100);

    if (this.currentThumb === 'right') {
      this.selected.to = this.toValue(Math.round(percentXRightValue));
      this.subElements.to.textContent = this.formatValue(this.selected.to);
      this.subElements.scale.style = `left: ${this.selected.fromPersent}%;right:${percentXRight}%`;
      this.selected.toPersent = percentXRight;
      this.selected.toPx = normalizeClickX;
      this.subElements.thumbRight.style = `right: ${percentXRight}%`;
    }

    if (this.currentThumb === 'left') {
      this.selected.from = this.toValue(Math.round(percentXLeft));
      this.subElements.from.textContent = this.formatValue(this.selected.from);
      this.subElements.scale.style = `left: ${percentXLeft}%;right:${this.selected.toPersent}%`;
      this.selected.fromPersent = percentXLeft;
      this.selected.fromPx = normalizeClickX;
      this.subElements.thumbLeft.style = `left: ${percentXLeft}%`;
    }
  }

  handleDocumentPointerUp = (e) => {
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
}
