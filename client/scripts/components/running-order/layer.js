import api from '../../api/api.js';
import getLogger from '../../util/logger.js';
import { tagName as partTagName } from './part.js';
import { store } from '../../state/store.js';

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
      this.parts = [...parts];
      this.partsUpdatedSinceLastRender = true;
      logger.log(`Parts from store are not the same as local parts, updating`, {
        local: this.parts,
      });
    } else {
      logger.log(`Parts from store are the same as local parts, not updating`, {
        local: this.parts,
        store: parts,
      });
    }
  }

  renderParts() {
    if (this.partsUpdatedSinceLastRender !== true) {
      logger.log(`renderParts() called, but no updates since last render`);
      return;
    }

    const partElements = [];
    for (const part of this.parts) {
      const partElement = document.createElement(partTagName);
      partElement.dataset.uuid = part.uuid;
      partElements.push(partElement);
    }
    this.shadowRoot.append(...partElements);
    this.partsUpdatedSinceLastRender = false;
    logger.log(`renderParts() called, re-rendered parts`, { partElements });
  }
}

customElements.define(tagName, Layer);
