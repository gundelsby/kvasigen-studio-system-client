import {
  addNewOrderedElements,
  removeElements,
} from '../util/elementListHelpers.js';
import api from '../../api/api.js';
import getLogger from '../../util/logger.js';
import { html } from '../../util/syntax-helpers.js';
import { tagName as layerTagName } from './layer.js';
import { store } from '../../state/store.js';

const tagName = 'running-order';

const classNames = {
  LAYERS_CONTAINER: 'layers',
  DROP_TARGET: 'drop-target',
};

export default { tagName };

const logger = getLogger(`components:${tagName}`);

// scene instances goes here
const content = html`<section class="running-order">
  <div class="${classNames.LAYERS_CONTAINER}"></div>
  <div class="${classNames.DROP_TARGET}">
    Drop scene here to create a new layer
  </div>
</section>`;

class RunningOrder extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = content;

    /** @type string[] */
    this.layers = [];
    this.unsubCallbacks = [];
  }

  connectedCallback() {
    logger.log(`Connected`);

    /** @type HTMLElement */
    this.layersRoot = this.shadowRoot.querySelector(
      `.${classNames.LAYERS_CONTAINER}`,
    );

    // UI event listeners
    this.addEventListener('drop', this.dropHandler.bind(this));
    this.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });
    this.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    // store event listeners
    this.unsubCallbacks.push(
      store.subscribe(this.storeUpdatedHandler.bind(this)),
    );
    this.layers =
      api.demodata.script.layers.getLayers().map((l) => l.uuid) || [];
    if (this.layers.length < 1) {
      this.addLayer();
    }
    this.storeUpdatedHandler();
  }

  disconnectedCallback() {
    for (const callback of this.unsubCallbacks) {
      callback();
    }
  }

  storeUpdatedHandler() {
    const currentLayers = new Set(this.layers);
    const storeLayers = new Set(
      api.demodata.script.layers.getLayers().map((l) => l.uuid),
    );

    if (
      currentLayers.size === storeLayers.size &&
      currentLayers.symmetricDifference(storeLayers).size === 0
    ) {
      logger.log(
        `Layers from store are the same as local layer, not updating. Layer count is ${this.layers.length}`,
      );
      return;
    }

    const layersToRemove = currentLayers.difference(storeLayers);
    const layersToAdd = storeLayers.difference(currentLayers);
    logger.log(`Layers from store are not the same as local layers, updating`, {
      local: this.layers,
      store: Array.from(storeLayers),
      layersToRemove,
      layersToAdd,
    });

    if (layersToRemove.size > 0) {
      removeElements(layersToRemove, this.layersRoot);
    }

    this.layers = Array.from(storeLayers);
    //TODO: reorder existing layer elements if order changed

    if (layersToAdd.size > 0) {
      addNewOrderedElements(
        layersToAdd,
        this.layers.slice(),
        this.layersRoot,
        layerTagName,
      );
    }
  }

  /**
   * Handles a drag and drop drop event
   *
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

      const { scene } = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (typeof scene === 'object') {
        scene.startsAt = 0;
        scene.endsAt = 5000;
        this.addLayer({ parts: [scene] });
      }
    } catch (err) {
      logger.error(`Unable to process drop event`, { err });
    }
  }

  addLayer(data) {
    const parts = data?.parts ?? [];
    api.demodata.script.layers.createLayerWithParts({ parts });
  }
}

customElements.define(tagName, RunningOrder);
