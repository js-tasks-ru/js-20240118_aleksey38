import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
import BaseSortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

export default class SortableTable extends BaseSortableTableV2 {
  subElements = {}
  element;

  constructor(headersConfig, {url, ...props} = {}) {
    super(headersConfig, {props});
    this.urlPref = url;

    this.element = this.createElement(this.createTemplateElement());
    this.selectSubElements();

    this.subElements.header.innerHTML = this.createHeaderTemplate();
    this.subElements.body.innerHTML = this.createTableBodyTemplate(this.data);

    this.createEventListeners();
    // this.sortOnServer(this.sorted.id, this.sorted.order);
    this.render();

  }


  createUrl() {
    if (!this.url) {
      this.url = new URL(BACKEND_URL + '/' + this.urlPref);
    }
    // https://course-js.javascript.ru/api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30
    this.url.searchParams.set('_embed', 'subcategory.category');
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', 0);
    this.url.searchParams.set('_end', 4);

  }
  async getData() {
    const data = await fetchJson(this.url);

    this.data = data;
    console.log('async::');

    return data;
  }

  sortOnClient (id, order) {
    this.sort(id, order);
  }

  sortOnServer (id = 'title', order = 'asc') {
    console.log('sortOnServer:', this.url);
    this.sorted.id = id;
    this.sorted.order = order;

    this.createUrl();
    this.getData();

  }
  async render() {
    this.createUrl();
    this.getData();

    console.log('render:', this.data);

    this.subElements.header.innerHTML = this.createHeaderTemplate(this.sorted.id, this.sorted.order);
    this.subElements.body.innerHTML = this.createTableBodyTemplate(this.data);
  }

  handleDocumentClick = (event) => {
    console.log('new обработчик');
    let curDataSet;
    if (Object.hasOwn(event.target.dataset, 'id')) {
      curDataSet = event.target.dataset;
    } else if (Object.hasOwn(event.target.parentElement.dataset, 'id')) {
      curDataSet = event.target.parentElement.dataset;
    } else {
      curDataSet = undefined;
    }

    if (!curDataSet || curDataSet.id === 'images') {
      return;
    }

    let curOrder = curDataSet.order === 'desc' ? 'asc' : 'desc';
    this.sort(curDataSet.id, curOrder);
  }

  createEventListeners() {
    console.log('new - createEventListeners');

    document.body.addEventListener('pointerdown', this.handleDocumentClick);
  }

}
