import api from '../../api/api.js';
import areDeepEquals from '../../util/deepEquals.js';
import getTagNameForPartParameter from './part-parameter.js';
import getLogger from '../../util/logger.js';
import getStyleTag from './part-styles.js';
import { store } from '../../state/store.js';
import {
  addNewOrderedElements,
  removeElements,
} from '../util/elementListHelpers.js';
import { getPartParameter } from '../../api/demodata/script/part-parameters.js';

const tagName = `ro-part`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

class Part extends HTMLElement {
  constructor() {
    super();

    this.unsubCallbacks = [];

    this.partDataRoot = document.createElement('div');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(getStyleTag(), this.partDataRoot);
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
    logger.log(`Disconnected`, { uuid: this.uuid });
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
    if (!partData) {
      logger.warn(`No data found in store for part with uuid ${this.uuid}`);
      return;
    }

    if (areDeepEquals(this.data, partData)) {
      logger.log(
        `Part data in store is equal to part data in element, not updating`,
      );
      return;
    }

    const currentParameterSet = new Set(this.data.parameters);
    const storeParameterSet = new Set(partData.parameters);
    if (
      currentParameterSet.size !== storeParameterSet.size &&
      currentParameterSet.symmetricDifference(storeParameterSet).size > 0
    ) {
      const parametersToRemove =
        currentParameterSet.difference(storeParameterSet);
      const parametersToAdd = storeParameterSet.difference(currentParameterSet);

      if (parametersToRemove.size > 0) {
        removeElements(parametersToRemove, this.paramsContainer);
      }

      if (parametersToAdd.size > 0) {
        addNewOrderedElements(
          parametersToAdd,
          Array.from(storeParameterSet),
          this.paramsContainer,
          null,
          getTagNameForPartParameter,
        );
      }
    }

    this.data = partData;
  }

  render() {
    const { id, parameters } = this.data;
    const idElement = document.createElement('p');
    idElement.classList.add('scene-type');
    idElement.textContent = `${id}`;

    //TODO: rewrite to avoid re-rendering of existing parameter elements
    const paramElements = parameters.map(getTagNameForPartParameter);

    const paramsContainer = document.createElement('div');
    paramsContainer.classList.add('parameters');
    paramsContainer.append(...paramElements);

    this.partDataRoot.replaceChildren(idElement, paramsContainer);

    this.dataUpdatedSinceLastRender = false;
    logger.success(`render(): Rendered part ${this.uuid}`, {
      innerHTML: this.innerHTML,
    });
  }
}

customElements.define(tagName, Part);
