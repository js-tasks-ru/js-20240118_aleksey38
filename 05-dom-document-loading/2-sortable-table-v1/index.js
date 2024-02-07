export default class SortableTable {

  field = 'title';
  order = '';
  subElements = {};

  constructor(headerConfig = [], data = []) {
    // this.getSortVar()
    this.headerConfig = headerConfig
    this.data = data.sort(this.customSort(this.field, this.order))

    this.element = this.createElement(this.templateMain())
  }

  createElement(template){
    const head = document.createElement('div')

    head.innerHTML = template
    return head.firstElementChild
  }

  getSortVar(){
    this.order = document.getElementById('order').value
    this.field = document.getElementById('field').value
  }

  sort(field, order){
    this.order = order
    this.field = field
    this.element.remove()

    this.data = this.data.sort(this.customSort(this.field, this.order))
    this.templateBody()
    this.element = this.createElement(this.templateMain())
    // document.getElementById('root').append(this.element)

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

  templateBody(){
    let res = '<div data-element="body" class="sortable-table__body">'
    for (const arg of this.data) {
      res += `
        <a href="/products/${arg.id}" class="sortable-table__row">
          <div class="sortable-table__cell">${arg.title}<img class="sortable-table-image" alt="Image" src=""></div>
          <div class="sortable-table__cell">${arg.price}</div>
          <div class="sortable-table__cell">${arg.title}</div>
  
          <div class="sortable-table__cell">${arg.discount}</div>
          <div class="sortable-table__cell">${arg.sales}</div>
        </a>
      `
    }
    res += '</div>'

    const body = document.createElement('div')

    body.innerHTML = res
    this.subElements.body = body.firstElementChild
    return res
  }

  templateMain(){
    return(`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
        
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.templateHeader()}
          </div>
          ${this.templateBody()}
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

  customSort(field = 'title', order = 'asc'){

    const collator = new Intl.Collator(["ru-RU", "en-EN"], {
      caseFirst: "upper"
    });

    if (order === 'desc') {
      return function(a, b) {
        if (field === 'price'){
          return  b[field] - a[field] ;
        }

        return collator.compare(a[field], b[field]) * -1;
      }
    }

    return function(a,b) {
      if (field === 'price'){
        return  a[field] - b[field];
      }

      return collator.compare(a[field], b[field]);
    }
  }

  remove(){
    this.element.remove()
  }

  destroy(){
    this.remove();
  }
}