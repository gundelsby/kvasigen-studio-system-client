import {
  addNewOrderedElements,
  removeElements,
} from '../util/elementListHelpers.js';
import api from '../../api/api.js';
import areDeepEquals from '../../util/deepEquals.js';
import getLogger from '../../util/logger.js';
import getStyleTag from './part-styles.js';
import getTagNameForPartParameter from './part-parameter.js';
import { store } from '../../state/store.js';

const tagName = `ro-part`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

const classNames = {
  ID_ELEMENT: 'scene-type',
};

class Part extends HTMLElement {
  constructor() {
    super();

    this.unsubCallbacks = [];

    this.partDataRoot = document.createElement('div');

    const idElement = document.createElement('p');
    idElement.classList.add(classNames.ID_ELEMENT);

    this.paramsContainer = document.createElement('div');
    this.paramsContainer.classList.add('parameters');

    this.partDataRoot.append(idElement, this.paramsContainer);

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
  }

  disconnectedCallback() {
    logger.log(`Disconnected`, { uuid: this.uuid });
    for (const unsubscribe of this.unsubCallbacks) {
      unsubscribe();
    }
  }

  storeUpdatedHandler() {
    this.getData();
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

    const currentParameterSet = new Set(this.data?.parameters || []);
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

    this.partDataRoot.querySelector(`.${classNames.ID_ELEMENT}`).textContent =
      partData.id;

    this.data = partData;
  }
}

customElements.define(tagName, Part);
