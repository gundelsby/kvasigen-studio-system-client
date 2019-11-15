import WebSocketConnection from '../../../scripts/network/websockets/connection.js';

const innerHTML = `<h2>Connect to server</h2>
  <form>
    <label>
      <span>URL to the sync server</span>
      <input name="url" type="url" placeholder="ws://localhost:9001" />
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
    try {
      const url = new URL(this.elements['url'].value);

      if (url.protocol !== 'ws:') {
        throw new Error('Only websocket connections allowed', url.href);
      }
      // Create WebSocket connection.
      const connection = new WebSocketConnection();
      connection.open(url);
    } catch (err) {
      console.log('fucked up setting up a connection', err);
    }
  }
}

customElements.define('connect-dialog', ConnectDialog);
