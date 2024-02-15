export default class NotificationMessage {
  static lastNotify

  constructor(message = '', {duration, type} = {}) {
    this.message = message;
    this.duration = duration || 1000;
    this.type = type || 'error';

    this.element = this.createBlock(this.createTemplate());
  }

  createBlock(template) {
    const block = document.createElement('div');
    block.innerHTML = template;
    return block.firstElementChild;
  }

  createTemplate() {
    return (`
        <div class="notification ${this.type}" style="--value:20s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
              ${this.message}
            </div>
          </div>
        </div>
    `);
  }

  show(container = document.body) {
    if (NotificationMessage.lastNotify) {
      NotificationMessage.lastNotify.destroy();
    }
    NotificationMessage.lastNotify = this;
    container.appendChild(this.element);

    this.timeoutID = setTimeout(() => { this.remove(); }, this.duration);

  }
  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }
}
