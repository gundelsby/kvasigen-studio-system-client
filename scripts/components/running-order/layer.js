import getLogger from '../../util/logger.js';
import { tagName as partTagName } from './part.js';
import { store } from '../../state/store.js';
import api from '../../api/api.js';

const tagName = `ro-layer`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

class Layer extends HTMLElement {
  constructor() {
    super();

    this.parts = [];
    this.unsubCallbacks = [];

    this.attachShadow({ mode: 'open' });

    this.partsUpdatedSinceLastRender = false;
  }

  connectedCallback() {
    this.unsubCallbacks.push(
      store.subscribe(this.storeUpdatedHandler.bind(this)),
    );
    this.uuid = this.dataset.uuid;
    logger.log(`Connected ${this.uuid}`);
    logger.log(this);

    this.getPartsFromStore();
    this.renderParts();
  }

  disconnectedCallback() {
    for (const unsubscribe of this.unsubCallbacks) {
      unsubscribe();
    }
  }

  storeUpdatedHandler() {
    this.getPartsFromStore();
    this.renderParts();
  }

  getPartsFromStore() {
    const parts = api.demodata.script.parts.getParts();
    if (parts && JSON.stringify(parts) !== JSON.stringify(this.parts)) {
      this.layers = [...parts];
      this.partsUpdatedSinceLastRender = true;
    }
  }

  renderParts() {
    if (this.partsUpdatedSinceLastRender !== true) {
      return;
    }

    const partElements = [];
    for (const part of this.parts) {
      const partElement = document.createElement(partTagName);
      partElement.dataset.uuid = part.uuid;
      partElements.push(partElement);
    }
    this.shadowRoot.append(partElements);
    this.partsUpdatedSinceLastRender = false;
  }
}

customElements.define(tagName, Layer);
