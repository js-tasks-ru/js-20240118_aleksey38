export default class SortableTable {

  field = 'title';
  order = '';
  subElements = {
    body: document.createElement('div')
  };


  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data
    this.sort('title', 'desc')

    this.element = this.createElement(this.templateMain())
  }

  createElement(template){
    const head = document.createElement('div')

    head.innerHTML = template
    return head.firstElementChild
  }

  prepareData(arr){
    const newData = []
    for (const elem of arr) {
      const newElem = {}
      newElem.id = elem.id
      if (Object.hasOwn(elem, 'images')) {
        newElem.images = elem.images[0].url
      }
      newElem.attr = []
      for (const arg of this.headerConfig) {
        if (!Array.isArray(elem[arg.id])){
          newElem.attr.push(elem[arg.id])
        }
      }
      newData.push(newElem)
    }
    return newData
  }

  sort(fieldValue, orderValue) {
    const orders = {
      'desc': 1,
      'asc': -1,
    }

    const arr = [...this.data].sort((itemA, itemB) => {
      const k = orders[orderValue]
      const valueA = itemA[fieldValue];
      const valueB = itemB[fieldValue];

      if (typeof valueA === 'string') {
        return k * valueB.localeCompare(valueA, 'ru-en', { caseFirst: 'upper' });
      }

      return  k * (valueB - valueA);
    });

    const res = this.prepareData(arr)

    this.subElements.body.innerHTML = this.createRowsBody(res);
  }

  templateHeader(){
    let res = ''
    for (const arg of this.headerConfig) {
      res += `
        <div class="sortable-table__cell" data-id="${arg.id}" data-sortable="${arg.sortable}" data-order="${this.order}">
          <span>${arg.title}</span>
         ${this.templateHeaderArrow(arg.id)}
        </div>
      `
    }
    return res
  }

  templateHeaderArrow(title){
    if (this.field === title) {
      return (`
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
        `)
    }
    return ''
  }

  createRowsBody(arr){

    this.subElements.body.classList.add("sortable-table__body");
    this.subElements.body.dataset.element = 'body'

    let res = ''
    for (const arg of arr) {
      res += `<a href="/products/${arg.id}" class="sortable-table__row">`

      if (Object.hasOwn(arg, 'images')) {
        res += `<div class="sortable-table__cell"><img class="sortable-table-image" alt="Image" src="${arg.images}"></div>`
      }

      for (const argElement of arg.attr) {
        res += `<div class="sortable-table__cell">${argElement}</div>`
      }

      res += `</a>`
    }
    return res
  }

  templateMain(){
    return(`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
        
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.templateHeader()}
          </div>
          ${this.subElements.body.outerHTML}
          
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `)
  }

  remove(){
    this.element.remove()
  }

  destroy(){
    this.remove();
  }
}
