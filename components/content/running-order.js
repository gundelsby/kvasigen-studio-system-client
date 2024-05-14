import getLogger from '../../scripts/util/logger.js';
import { html } from '../../scripts/util/html.js';

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
  }
}

customElements.define(tagName, RunningOrder);
