import fetchJson from './utils/fetch-json.js';

import BaseColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends BaseColumnChart {
  subElements = {};
  constructor({
    url = '',
    label = '',
    range = {},
    formatHeading = v => v
  } = {}) {
    super({url, label, formatHeading});
    this.props.url = url;
    this.props.from = range.from || '';
    this.props.to = range.to || '';

    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  async update(start, end) {
    let url = new URL(BACKEND_URL + '/' + this.props.url);
    url.searchParams.set('from', start);
    url.searchParams.set('to', end);
    let data = await fetchJson(url);
    this.props.data = Object.values(data);

    this.element.classList.remove("column-chart_loading");
    this.subElements.header.innerHTML = this.props.data.reduce((a, b) => a + b, 0);
    this.subElements.body.innerHTML = this.createChartBodyTemplate();

    return data;
  }
}
