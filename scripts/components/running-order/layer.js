import { tagName as partTagName } from './part.js';
import { store } from '../../state/store.js';
import getLogger from '../../util/logger.js';

const tagName = `ro-layer`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

class Layer extends HTMLElement {
  constructor() {
    super();

    this.parts = [];
    this.unsubCallbacks = [];

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.unsubCallbacks.push(
      store.subscribe(this.storeUpdatedHandler.bind(this)),
    );
    this.uuid = this.dataset.uuid;
    logger.log(`Connected ${this.uuid}`);
    logger.log(this);

    this.getPartsFromStore();
  }

  disconnectedCallback() {
    for (const callback of this.unsubCallbacks) {
      callback();
    }
  }

  storeUpdatedHandler() {
    this.getPartsFromStore();
  }

  getPartsFromStore() {
    const parts = store.getState().demoData.script.parts.slice();
    if (parts && JSON.stringify(parts) !== JSON.stringify(this.parts)) {
      this.layers = [...parts];
      this.renderParts();
    }
  }

  renderParts() {
    const partElements = [];
    for (const part of this.parts) {
      const partElement = document.createElement(partTagName);
      partElement.dataset.uuid = part.uuid;
      partElements.push(partElement);
    }
    this.shadowRoot.append(partElements);
  }
}

customElements.define(tagName, Layer);
