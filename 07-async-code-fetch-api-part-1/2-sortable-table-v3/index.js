import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
import BaseSortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

export default class SortableTable extends BaseSortableTableV2 {
  static SCROLL_ELEMENT = 10

  constructor(
    headersConfig,
    {url, isSortLocally = false, sorted = {} } = {},
  ) {
    super(headersConfig, {isSortLocally, sorted});
    this.urlPref = url;
    this.start = 0;
    this.end = 10;
  }

  sort(fieldName = 'title', orderName = 'asc') {
    if (this.isSortLocally) {
      this.sortOnServer(fieldName, orderName);
      this.sortOnClient(fieldName, orderName);
    } else {
      this.sortOnServer(fieldName, orderName);
    }
  }

  createUrl() {
    this.urlPref = this.urlPref || 'api/rest/products';
    const url = new URL(BACKEND_URL + '/' + this.urlPref);
    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('_sort', this.sorted.id);
    url.searchParams.set('_order', this.sorted.order);
    url.searchParams.set('_start', this.start || 0);
    url.searchParams.set('_end', this.end || SortableTable.SCROLL_ELEMENT);
    return url;

  }
  async loadData() {
    const url = this.createUrl();
    this.data = await fetchJson(url);
  }

  sortOnClient (id, order) {
    super.sort(id, order);
  }

  async sortOnServer (id = 'quantity', order = 'asc', x = '') {
    this.sorted.id = id;
    this.sorted.order = order;

    await this.loadData();

    this.renderDocumentBody(this.sorted.id, this.sorted.order);
  }

  async render() {
    if (this.isSortLocally) {
      await this.sortOnServer(this.sorted.id, this.sorted.order);
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      await this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }

  handleScrollWindow = () => {
    console.log('scroll');
  }

  handleScrollWindow2 (event) {
    const {scrollHeight, clientHeight} = document.documentElement;
    const {scrollY} = window;
    const bottomReached = scrollHeight - (scrollY + clientHeight) <= 0;
    if (bottomReached) {
      this.end += SortableTable.SCROLL_ELEMENT;
      this.render();
    }
  }

  createEventListeners() {
    super.createEventListeners();
    document.addEventListener('scroll', this.handleScrollWindow2.bind(this));
  }

  destroyEventListeners() {
    super.destroyEventListeners();
    window.addEventListener('scroll', this.handleScrollWindow2);
  }

}
