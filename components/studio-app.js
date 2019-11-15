import './connection/connect-dialog/connect-dialog.js';
import './transport/transport-bar.js';

const innerHTML = `<h1>Kvasigen Studio System</h1>
<section>
  <connect-dialog></connect-dialog>
  <transport-bar></transport-bar>
</section>
`;
class StudioApp extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = innerHTML;
  }
}

customElements.define('studio-app', StudioApp);
