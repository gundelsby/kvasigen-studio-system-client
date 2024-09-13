import {
  addNewOrderedElements,
  removeElements,
} from '../util/elementListHelpers.js';
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
      store.subscribe(this.getPartsFromStore.bind(this)),
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
        const { uuid: partId } = api.demodata.script.parts.createPart(partData);
        api.demodata.script.layers.addPartToLayer(this.uuid, partId);
        logger.success(`Added new part ${partId} for layer ${this.uuid}`);
      }
    } catch (err) {
      logger.error(`Unable to process drop event`, { err });
    }
  }

  getPartsFromStore() {
    const currentPartsUuids = new Set(this.parts);
    const storePartsUuids = new Set(
      api.demodata.script.layers.getLayer(this.uuid)?.parts || [],
    );
    if (
      storePartsUuids.size === currentPartsUuids.size &&
      storePartsUuids.symmetricDifference(currentPartsUuids).size === 0
    ) {
      logger.log(`Parts from store are the same as local parts, not updating`, {
        local: this.parts,
        store: currentPartsUuids,
      });
      return;
    }
    const partsToRemoveUuids = currentPartsUuids.difference(storePartsUuids);
    const partsToAddUuids = storePartsUuids.difference(currentPartsUuids);
    logger.log(`Parts from store are not the same as local parts, updating`, {
      local: this.parts,
      store: storePartsUuids,
      partsToRemove: partsToRemoveUuids,
      partsToAdd: partsToAddUuids,
    });

    if (partsToRemoveUuids.size > 0) {
      removeElements(partsToRemoveUuids, this.partsRoot);
    }

    const partsFromStore = Array.from(storePartsUuids).map(
      api.demodata.script.parts.getPart,
    );

    this.parts = partsFromStore
      .slice()
      .sort((a, b) => a.startsAt - b.startsAt)
      .map((p) => p.uuid);
    //TODO: reorder existing part elements after sorting (if order changed)

    if (partsToAddUuids.size > 0) {
      addNewOrderedElements(
        partsToAddUuids,
        this.parts.slice(),
        this.partsRoot,
        partTagName,
      );
    }
  }
}

customElements.define(tagName, Layer);
