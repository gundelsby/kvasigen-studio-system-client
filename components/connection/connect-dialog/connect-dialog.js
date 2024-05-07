import noc, { EVENT_NAMES } from '../../../scripts/network/noc.js';
import getLogger from '../../../scripts/util/logger.js';
import { html } from '../../../scripts/util/html.js';

const tagName = 'connect-dialog';
export default { tagName };

const logger = getLogger(`components:${tagName}`);

const innerHTML = html`<h2>Connect to server</h2>
  <form>
    <label>
      <span>URL to the sync server</span>
      <input name="url" type="url" placeholder="ws://localhost:5246" />
    </label>
    <button name="submit" type="submit">Connect</button>
  </form>`;

class ConnectDialog extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = innerHTML;

    this.form = shadowRoot.querySelector('form');

    logger.log(this.form.elements);

    document.addEventListener(
      EVENT_NAMES.ENGINE_CONNECTED,
      this.engineConnectedHandler.bind(this),
    );

    document.addEventListener(EVENT_NAMES.ENGINE_DISCONNECTED) {
      //TODO: reset form to disconnect state
    }
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.onsubmitHandler);
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.onsubmitHandler);
  }

  engineConnectedHandler(event) {
    logger.log(`Engine connected event received`, this.form.elements);
    this.engineIsConnected = true;

    const { url } = event.detail;
    const urlInput = this.form.elements['url'];
    urlInput.value = url;
    urlInput.disabled = true;

    const submitButton = this.form.elements['submit'];
    submitButton.textContent = 'Disconnect';
    //TODO: change label text
  }

  onsubmitHandler(event) {
    event.preventDefault();

    if(this.engineIsConnected) {
      noc.closeEngineConnection()
    }

    let urlString =
      this.elements['url'].value || this.elements['url'].placeholder;

    logger.log(
      `url: ${urlString}, value: ${this.elements['url'].value}, placeholder: ${this.elements['url'].placeholder}`,
    );

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
