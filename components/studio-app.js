import connectDialogComponent from './connection/connect-dialog/connect-dialog.js';
import getLogger from '../scripts/util/logger.js';
import { html } from '../scripts/util/html.js';
import runningOrderComponent from './content/running-order.js';
import sceneBrowserComponent from './scene-browser/scene-browser.js';

const tagName = 'studio-app';

const logger = getLogger(tagName);

const content = html`<header>
    <h1>Kvasigen Studio System</h1>
  </header>
  <nav></nav>
  <main></main>
  <footer>
    <p>I didn't even know what a nuclear panther plant was!</p>
  </footer> `;

class StudioApp extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = content;
  }

  connectedCallback() {
    logger.log(`connectedCallback`);

    const header = this.shadowRoot.querySelector('header');
    header.appendChild(document.createElement(connectDialogComponent.tagName));

    const main = this.shadowRoot.querySelector('main');
    main.appendChild(document.createElement(runningOrderComponent.tagName));
    main.appendChild(document.createElement(sceneBrowserComponent.tagName));
  }
}

customElements.define(tagName, StudioApp);
