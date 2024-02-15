export default class ColumnChart {
  props = {}
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '#',
    formatHeading = v => v
  } = {}) {
    this.props.data = data;
    this.props.label = label;
    this.props.value = value;
    this.props.formatHeading = formatHeading;
    this.props.link = link;

    this.element = this.createElement(this.template());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createChartBodyTemplate() {
    return this.getColumnProps().map(({percent, value}) => (
      `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
    )).join('');
  }
  createClassesChart() {
    return this.props.data.length ? 'column-chart' : 'column-chart column-chart_loading';
  }
  createLinkTemplate() {
    if (this.props.link) {
      return `<a href="/${this.props.link}" class="column-chart__link">View all</a>`;
    }
    return '';
  }

  template() {
    return (`
        <div class="${this.createClassesChart()}" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            ${this.props.label}
            ${this.createLinkTemplate()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.props.formatHeading(this.props.value)}</div>
            <div data-element="body" class="column-chart__chart">
              ${this.createChartBodyTemplate()}
            </div>
          </div>
        </div>
    `);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(newData) {
    this.props.data = newData;
    this.element.querySelector('[data-element="body"]').innerHTML = this.createChartBodyTemplate();
  }

  getColumnProps() {
    const maxValue = Math.max(...this.props.data);
    const scale = 50 / maxValue;

    return this.props.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });

  }
}
