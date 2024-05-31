import { tagName as partTagName } from './part.js';
import { store } from '../../state/store.js';

const tagName = `ro-layer`;

export default { tagName };

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
  }

  disconnectedCallback() {
    for (const callback of this.unsubCallbacks) {
      callback();
    }
  }

  storeUpdatedHandler() {
    //I should build an API for this shit
    const parts = store
      .getState()
      .demoData.script.parts.filter((p) => p.layer === this.uuid);
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
    }
    this.shadowRoot.append(partElements);
  }
}

customElements.define(tagName, Layer);
