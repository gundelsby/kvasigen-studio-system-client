import getLogger from '../../util/logger.js';
import { html } from '../../util/html.js';

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

    this.scenes = [];
  }

  connectedCallback() {
    logger.log(`Connected`);

    this.addEventListener('drop', (event) => {
      this.sceneDropHandler(event);
    });
    this.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
  }

  sceneDropHandler(event) {
    event.preventDefault();

    const { dataTransfer } = event;
    if (!dataTransfer) {
      logger.warn(`No dataTransfer prop in drop event`);
    }

    const newScene = JSON.parse(dataTransfer.getData('text/plain'));
    this.scenes.push(newScene);
    logger.log(`Added new scene to running order`, { ...newScene });
    logger.log(`Number of scenes in running order: ${this.scenes.length}`);
  }
}

customElements.define(tagName, RunningOrder);
