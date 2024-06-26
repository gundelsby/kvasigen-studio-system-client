import api from '../../api/api.js';
import { createParameterElement } from './part-parameter.js';
import getLogger from '../../util/logger.js';
import { store } from '../../state/store.js';

const tagName = `ro-part`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

class Part extends HTMLElement {
  constructor() {
    super();

    this.unsubCallbacks = [];

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.uuid = this.dataset.uuid;
    logger.log(`Connected`, { uuid: this.uuid });
    logger.log(this);
    this.unsubCallbacks.push(
      store.subscribe(this.storeUpdatedHandler.bind(this)),
    );

    this.getData();
    this.render();
  }

  disconnectedCallback() {
    for (const unsubscribe of this.unsubCallbacks) {
      unsubscribe();
    }
  }

  storeUpdatedHandler() {
    this.getData();
    this.render();
  }

  getData() {
    const partData = api.demodata.script.parts.getPart(this.uuid);
    if (partData) {
      this.data = partData;
      this.dataUpdatedSinceLastRender = true;
    } else {
      logger.warn(`No data found in store for part with uuid ${this.uuid}`);
    }
  }

  render() {
    if (this.dataUpdatedSinceLastRender !== true) {
      return;
    }

    const { id, parameters } = this.data;
    const idElement = document.createElement('p');
    idElement.classList.add('scene-type');
    idElement.textContent = id;
    const paramElements = parameters.map(createParameterElement);

    const paramsContainer = document.createElement('div');
    paramsContainer.classList.add('parameters');
    paramsContainer.append(...paramElements);

    this.shadowRoot.replaceChildren(idElement, paramsContainer);

    this.dataUpdatedSinceLastRender = false;
    logger.success(`render(): Rendered part ${this.uuid}`, {
      innerHTML: this.innerHTML,
    });
  }
}

customElements.define(tagName, Part);
