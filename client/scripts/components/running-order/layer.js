import api from '../../api/api.js';
import getLogger from '../../util/logger.js';
import getStyleTag from './layer-styles.js';
import { tagName as partTagName } from './part.js';
import { store } from '../../state/store.js';

const tagName = `ro-layer`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

const DEFAULT_PART_DURATION = 5000; // duration in ms, used for adding new parts

class Layer extends HTMLElement {
  constructor() {
    super();

    /** @type {string[]} */
    this.parts = [];
    /** @type {function[]} */
    this.unsubCallbacks = [];

    /** @type {HTMLElement} */
    this.partsRoot = document.createElement('div');
    this.partsRoot.textContent = 'Drop scene here to create a new part';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(getStyleTag(), this.partsRoot);
  }

  connectedCallback() {
    this.unsubCallbacks.push(
      store.subscribe(this.storeUpdatedHandler.bind(this)),
    );
    this.uuid = this.dataset.uuid;
    logger.log(`Connected ${this.uuid}`);

    this.classList.add('drop-target');

    // UI event listeners
    this.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });
    this.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.addEventListener('drop', this.dropHandler.bind(this));

    this.getPartsFromStore();

    // render parts
    const partElements = [];
    for (const uuid of this.parts) {
      const partElement = document.createElement(partTagName);
      partElement.dataset.uuid = uuid;
      partElements.push(partElement);
    }
    this.partsRoot.append(...partElements);
  }

  disconnectedCallback() {
    for (const unsubscribe of this.unsubCallbacks) {
      unsubscribe();
    }
  }

  /**
   * @param {DragEvent} event
   */
  dropHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    try {
      const { dataTransfer } = event;
      if (!dataTransfer) {
        logger.error(
          `No dataTransfer prop in drop event, unable to process drop`,
        );
        return;
      }

      const data = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (typeof data.scene === 'object') {
        // determine start time for new part (1ms after last current part as default)
        let startsAt = 0; // set to start of demo
        if (this.parts.length > 0) {
          const lastCurrentPart = api.demodata.script.parts.getPart(
            this.parts.at(-1),
          );
          if (lastCurrentPart?.endsAt) {
            startsAt = lastCurrentPart.endsAt + 1;
          }
        }
        const endsAt = startsAt + DEFAULT_PART_DURATION;
        const partData = Object.assign({}, data.scene, {
          layer: this.uuid,
          startsAt,
          endsAt,
        });
        const { uuid } = api.demodata.script.parts.createPart(partData);
        // this.parts.add(uuid); //TODO: update layer in store instead, let storeUpdatedHandler take care of the update
        logger.success(`Added new part ${uuid} for layer ${this.uuid}`);
      }
    } catch (err) {
      logger.error(`Unable to process drop event`, { err });
    }
  }

  storeUpdatedHandler() {
    this.getPartsFromStore();
  }

  getPartsFromStore() {
    const partsFromStore = api.demodata.script.parts.getParts({
      partProps: { layer: this.uuid },
    });
    const currentPartsUuids = new Set(this.parts);
    const storePartsUuids = new Set(partsFromStore.map((p) => p.uuid));

    if (
      storePartsUuids.size === currentPartsUuids.size &&
      storePartsUuids.symmetricDifference(currentPartsUuids).size === 0
    ) {
      logger.log(`Parts from store are the same as local parts, not updating`, {
        local: this.parts,
        store: partsFromStore,
      });
      return;
    }

    const partsToRemoveUuids = currentPartsUuids.difference(storePartsUuids);
    const partsToAddUuids = storePartsUuids.difference(currentPartsUuids);
    logger.log(`Parts from store are not the same as local parts, updating`, {
      local: this.parts,
      store: partsFromStore,
      partsToRemove: partsToRemoveUuids,
      partsToAdd: partsToAddUuids,
    });

    this.removePartElements(partsToRemoveUuids);
    this.parts = partsFromStore
      .slice()
      .sort((a, b) => a.startsAt - b.startsAt)
      .map((p) => p.uuid);
    this.addPartElements(partsToAddUuids);
  }

  removePartElements(partIds) {
    logger.log(`Removing parts...`, { partIds });
    for (const id of partIds) {
      const partElement = this.partsRoot.querySelector(`[data-uuid]=${id}`);
      if (partElement) {
        partElement.remove();
        logger.success(`Removed element for ${id}`);
      } else {
        logger.warn(`Unable to find element for ${id}, not removed`);
      }
    }
  }

  /**
   * Adds parts to the internal parts list, creates new html elements for them and does necessary reordering
   * @param {string[]} partsToAddUuids
   */
  addPartElements(partsToAddUuids) {
    // create elements for new parts
    const newPartElements = [];

    for (const uuid of partsToAddUuids) {
      const partElement = document.createElement(partTagName);
      partElement.dataset.uuid = uuid;
      newPartElements.push(partElement);
    }

    // insert the new HTML elements using order from this.parts
    for (let i = 0; i < this.parts.length; i++) {
      const uuid = this.parts[i];
      const newPartElement = newPartElements.find((p) => p.uuid === uuid);
      if (!newPartElement) {
        // not a new element, nothing to do here
        continue;
      }

      // this uuid represents a new part that needs its element inserted into the dom
      if (i === 0) {
        // this is the new first part
        this.partsRoot.prepend(newPartElement);
      } else {
        const previousUuid = this.parts[i - 1];
        const elementToInsertAfter = this.partsRoot.querySelector(
          `[data-uuid=${previousUuid}]`,
        );
        if (!elementToInsertAfter) {
          console.error(
            `Unable to insert new part ${uuid}, because the element for the part before it (uuid: ${previousUuid}) can't be found `,
          );
        }

        this.partsRoot.insertBefore(
          newPartElement,
          elementToInsertAfter.nextSibling,
        );
      }
    }
  }

  // renderParts() {
  //   if (this.partsUpdatedSinceLastRender !== true) {
  //     logger.log(`renderParts() called, but no updates since last render`);
  //     return;
  //   }

  //   const partElements = [];
  //   for (const uuid of this.parts) {
  //     const partElement = document.createElement(partTagName);
  //     partElement.dataset.uuid = uuid;
  //     partElements.push(partElement);
  //   }
  //   this.partsRoot.replaceChildren(...partElements);
  //   this.partsUpdatedSinceLastRender = false;
  //   logger.log(`renderParts() called, re-rendered parts`, { partElements });
  // }
}

customElements.define(tagName, Layer);
