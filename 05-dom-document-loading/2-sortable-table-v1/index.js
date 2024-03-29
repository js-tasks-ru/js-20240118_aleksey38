export default class SortableTable {
  subElements = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplateElement());
    this.selectSubElements();

    this.subElements.header.innerHTML = this.createHeaderTemplate();
    this.subElements.body.innerHTML = this.createTableBodyTemplate(this.data);

  }
  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  sort(fieldName = 'title', orderName = 'desc') {
    const orders = {
      'desc': 1,
      'asc': -1,
    };
    const sortedData = [...this.data].sort((itemA, itemB) => {
      const k = orders[orderName];
      const valueA = itemA[fieldName];
      const valueB = itemB[fieldName];

      if (typeof valueA === 'string') {
        return k * valueB.localeCompare(valueA, 'ru-en', { caseFirst: 'upper' });
      }
      return k * (valueB - valueA);
    });

    this.subElements.header.innerHTML = this.createHeaderTemplate(fieldName, orderName);
    this.subElements.body.innerHTML = this.createTableBodyTemplate(sortedData);
  }

  createHeaderTemplate(sortField = '', sortOrder = '') {
    let res = '';
    for (const columnConfig of this.headerConfig) {
      res += `
        <div class="sortable-table__cell" data-id="${columnConfig.id}" data-sortable="${columnConfig.sortable}" data-order="${sortOrder}">
          <span>${columnConfig.title}</span>
         ${this.createHeaderArrowTemplate(sortField, columnConfig.id)}
        </div>
      `;
    }
    return res;
  }

  createHeaderArrowTemplate(sortField, title) {
    if (sortField === title) {
      return (`
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
        `);
    }
    return '';
  }

  createTableBodyTemplate(data) {
    let res = '';
    for (const arg of data) {
      res += `<a href="/products/${arg.id}" class="sortable-table__row">`;
      for (const column of this.headerConfig) {
        if (Object.hasOwn(column, 'template')) {
          res += `<div class="sortable-table__cell">${column.template(column.images)}</div>`;
        } else {
          res += `<div class="sortable-table__cell">${arg[column.id]}</div>`;
        }
      }
      res += `</a>`;
    }
    return res;
  }

  createTemplateElement() {
    return (`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
        
          <div data-element="header" class="sortable-table__header sortable-table__row"></div>
          <div data-element="body" class="sortable-table__body"></div>
          
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
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
}