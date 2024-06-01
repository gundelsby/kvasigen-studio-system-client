import getLogger from '../../util/logger.js';

const tagName = `ro-part`;

export { tagName };

const logger = getLogger(`component:${tagName}`);

class Part extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.uuid = this.dataset.uuid;
    this.shadowRoot.append(this.uuid);
    logger.log(`Connected`, { uuid: this.uuid });
    logger.log(this);
  }
}

customElements.define(tagName, Part);
