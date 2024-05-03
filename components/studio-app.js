import './connection/connect-dialog/connect-dialog.js';
import './transport/transport-bar.js';
import { dataStore } from '../scripts/state/constants.js';

const innerHTML = `<h1>Kvasigen Studio System</h1>
<section>
  <connect-dialog></connect-dialog>
  <transport-bar></transport-bar>
</section>
`;
class StudioApp extends HTMLElement {
  constructor() {
    super();

    document.addEventListener(dataStore.STATE_UPDATED, (event) => {
      console.log(event);
    });

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = innerHTML;
  }
}

customElements.define('studio-app', StudioApp);
