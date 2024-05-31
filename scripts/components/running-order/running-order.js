import actionTypes from '../../state/action-types.js';
import getLogger from '../../util/logger.js';
import { html } from '../../util/html.js';
import { store } from '../../state/store.js';

const tagName = 'running-order';

const classNames = {
  DROP_TARGET: 'drop-target',
};

export default { tagName };

const logger = getLogger(`components:${tagName}`);

// scene instances goes here
const content = html`<section class="running-order">
  <div class="${classNames.DROP_TARGET}">
    Drop scenes here to add to running order
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
    this.addEventListener('dragover', this.dragoverHandler.bind(this));

    // store event listeners
    this.unsubCallbacks.push(
      store.subscribe(this.storeUpdatedListener.bind(this)),
    );
    this.layers = store.getState().demoData.script.layers || [];
    if (this.layers.length < 1) {
      this.addLayer();
    }
  }

  disconnectedCallback() {
    for (const callback of this.unsubCallbacks) {
      callback();
    }
  }

  dragoverHandler(event) {
    event.preventDefault();
  }

  storeUpdatedListener() {
    const newLayers = store.getState().demoData.script.layers;
    if (
      newLayers &&
      JSON.stringify(newLayers) !== JSON.stringify(this.layers)
    ) {
      this.layers = newLayers.slice();
      this.renderLayers();
    }
  }

  dropHandler(event) {
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
        this.addScene(data.scene);
      }
    } catch (err) {
      logger.error(`Unable to process drop event`, { err });
    }
  }

  addScene(scene) {
    store.dispatch({
      type: actionTypes.demodata.script.parts.ADD_PART,
      payload: scene,
    });
  }

  addLayer() {
    store.dispatch(actionTypes.demodata.script.layers.ADD_LAYER, null);
  }

  renderLayers() {}
}

customElements.define(tagName, RunningOrder);
