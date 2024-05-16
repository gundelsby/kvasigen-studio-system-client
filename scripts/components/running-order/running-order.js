import getLogger from '../../util/logger.js';
import { html } from '../../util/html.js';

const tagName = 'running-order';

export default { tagName };

const logger = getLogger(`components:${tagName}`);

// scene instances goes here
const content = html`<section class="running-order">
  <div class="drop-target">Drop scenes here to add to running order</div>
</section>`;

class RunningOrder extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = content;
  }

  connectedCallback() {
    logger.log(`Connected`);

    this.addEventListener('drop', (ev) => {
      this.sceneDropHandler(ev);
    });
    this.addEventListener('dragover', (ev) => {
      this.sceneDropHandler(ev);
    });
  }

  sceneDropHandler(event) {
    event.preventDefault();

    const { dataTransfer } = event;
    if (!dataTransfer) {
      logger.warn(`No dataTransfer prop in drag event`);
    }
    for (const type of dataTransfer.types) {
      const data = dataTransfer.getData(type);
      logger.log(`Data for type ${type}`, { type: typeof data, data });
    }
  }
}

customElements.define(tagName, RunningOrder);
