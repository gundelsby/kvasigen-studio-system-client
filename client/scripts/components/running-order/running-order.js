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

    this.layers = [];
    this.unsubCallbacks = [];
  }

  connectedCallback() {
    logger.log(`Connected`);

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
    this.layers = api.demodata.script.layers.getLayers() || [];
    if (this.layers.length < 1) {
      this.addLayer();
    }
    this.renderLayers();
  }

  disconnectedCallback() {
    for (const callback of this.unsubCallbacks) {
      callback();
    }
  }

  storeUpdatedHandler() {
    const newLayers = api.demodata.script.layers.getLayers();

    if (
      newLayers &&
      JSON.stringify(newLayers) !== JSON.stringify(this.layers)
    ) {
      this.layers = newLayers.slice();
      logger.log(`Updated layers, layer count is ${this.layers.length}`);
      this.renderLayers();
    } else {
      logger.log(
        `Store updated, but layers not updated. Layer count is ${this.layers.length}`,
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

      const data = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (typeof data.scene === 'object') {
        this.addLayer({ parts: [data.scene] });
      }
    } catch (err) {
      logger.error(`Unable to process drop event`, { err });
    }
  }

  addLayer(data) {
    const parts = data?.parts ?? [];
    api.demodata.script.layers.createLayerWithParts({ parts });
  }

  renderLayers() {
    const layerElements = [];

    for (const layer of this.layers) {
      const el = document.createElement(layerTagName);
      el.dataset.uuid = layer.uuid;

      logger.log(`Created element`, { el });
      layerElements.push(el);
    }

    this.shadowRoot
      .querySelector(`.${classNames.LAYERS_CONTAINER}`)
      .replaceChildren(...layerElements);
  }
}

customElements.define(tagName, RunningOrder);
