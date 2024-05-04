import getLogger from '../../../scripts/util/logger.js';
import { html } from '../../../scripts/util/html.js';
import WebSocketConnection from '../../../scripts/network/websockets/connection.js';

const tagName = 'connect-dialog';
export default { tagName };

const logger = getLogger(`components:${tagName}`);

const innerHTML = html`<h2>Connect to server</h2>
  <form>
    <label>
      <span>URL to the sync server</span>
      <input name="url" type="url" placeholder="ws://localhost:5246" />
    </label>
    <button type="submit">Connect</button>
  </form>`;

class ConnectDialog extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = innerHTML;

    this.form = shadowRoot.querySelector('form');
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.onsubmitHandler);
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.onsubmitHandler);
  }

  onsubmitHandler(event) {
    event.preventDefault();

    let urlString =
      this.elements['url'].value ?? this.elements['url'].placeholder;

    try {
      const url = new URL(urlString);

      if (url.protocol !== 'ws:') {
        throw new Error('Only websocket connections allowed', url.href);
      }
      // Create WebSocket connection.
      const connection = new WebSocketConnection();
      connection.open(url);
      logger.log(`Form submitted, called connection library open`);
    } catch (err) {
      logger.error(
        `fucked up setting up a connection using url ${urlString}`,
        err,
      );
    }
  }
}

customElements.define(tagName, ConnectDialog);
