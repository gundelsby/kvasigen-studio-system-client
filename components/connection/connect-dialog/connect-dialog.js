const innerHTML = `<label>
      <span>URL to the sync server</span>
      <input name="url" type="url" placeholder="ws://localhost:9001" />
    </label>
    <button type="submit">Connect</button>`;

class ConnectDialog extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this.form = shadowRoot.appendChild(document.createElement('form'));
    this.form.innerHTML = innerHTML;
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
      const socket = new WebSocket(url);

      // Connection opened
      socket.addEventListener('open', function() {
        socket.send('Hello Server!');
      });

      // Listen for messages
      socket.addEventListener('message', function(event) {
        console.log('Message from server ', event.data);
      });

      socket.addEventListener('error', console.log);
    } catch (err) {
      console.log('fucked up setting up a connection', err);
    }
  }
}

customElements.define('connect-dialog', ConnectDialog);

console.log('done');
