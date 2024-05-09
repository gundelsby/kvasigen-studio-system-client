import noc, { EVENT_NAMES } from '../../../scripts/network/noc.js';
import getLogger from '../../../scripts/util/logger.js';
import { html } from '../../../scripts/util/html.js';

const tagName = 'connect-dialog';
export default { tagName };

const logger = getLogger(`components:${tagName}`);

const textContent = {
  LABEL_CONNECTED: 'Connected to',
  LABEL_DISCONNECTED: 'URL to the sync server',
  SUBMIT_BUTTON_CONNECTED: 'Disconnect',
  SUBMIT_BUTTON_DISCONNECTED: 'Connect',
};

const formElementNames = {
  URL_INPUT: 'url',
  SUBMIT_BUTTON: 'submit',
};

const classNames = {
  URL_INPUT_LABEL: 'label-text',
};

const innerHTML = html`<h2>Connect to server</h2>
  <form>
    <label>
      <span class="${classNames.URL_INPUT_LABEL}"
        >${textContent.LABEL_DISCONNECTED}</span
      >
      <input
        name="${formElementNames.URL_INPUT}"
        type="url"
        placeholder="ws://localhost:5246"
      />
    </label>
    <button name="${formElementNames.SUBMIT_BUTTON}" type="submit">
      ${textContent.SUBMIT_BUTTON_DISCONNECTED}
    </button>
  </form>`;

class ConnectDialog extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = innerHTML;

    this.form = shadowRoot.querySelector('form');

    logger.log(this.form.elements);

    document.addEventListener(
      EVENT_NAMES.ENGINE_CONNECTED,
      this.engineConnectedHandler.bind(this),
    );

    document.addEventListener(
      EVENT_NAMES.ENGINE_DISCONNECTED,
      this.engineDisconnectedHandler.bind(this),
    );
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.onsubmitHandler);
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.onsubmitHandler);
  }

  engineConnectedHandler(event) {
    this.engineIsConnected = true;

    const { url } = event.detail;
    const urlInput = this.form.elements[formElementNames.URL_INPUT];
    urlInput.value = url;
    urlInput.disabled = true;

    const submitButton = this.form.elements[formElementNames.SUBMIT_BUTTON];
    submitButton.textContent = textContent.SUBMIT_BUTTON_CONNECTED;

    const inputLabel = this.shadowRoot.querySelector(
      `.${classNames.URL_INPUT_LABEL}`,
    );
    inputLabel.textContent = textContent.LABEL_CONNECTED;
  }

  engineDisconnectedHandler() {
    {
      this.engineIsConnected = false;
      const urlInput = this.form.elements[formElementNames.URL_INPUT];
      urlInput.disabled = false;

      const submitButton = this.form.elements[formElementNames.SUBMIT_BUTTON];
      submitButton.textContent = textContent.SUBMIT_BUTTON_DISCONNECTED;

      const inputLabel = this.shadowRoot.querySelector(
        `.${classNames.URL_INPUT_LABEL}`,
      );
      inputLabel.textContent = textContent.LABEL_DISCONNECTED;
    }
  }

  onsubmitHandler(event) {
    event.preventDefault();
    //TODO: handle submit in connected mode

    if (this.engineIsConnected) {
      noc.closeEngineConnection();
    }

    let urlString =
      this.elements[formElementNames.URL_INPUT].value ||
      this.elements[formElementNames.URL_INPUT].placeholder;

    try {
      const url = new URL(urlString);

      if (url.protocol !== 'ws:') {
        throw new Error('Only websocket connections allowed', url.href);
      }
      logger.log(`Form submitted, called connection library open`);
      noc.openEngineConnection(url);
    } catch (err) {
      logger.error(
        `fucked up setting up a connection using url ${urlString}`,
        err,
      );
    }
  }
}

customElements.define(tagName, ConnectDialog);
