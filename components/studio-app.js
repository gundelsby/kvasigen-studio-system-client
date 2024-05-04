import connectDialogComponent from './connection/connect-dialog/connect-dialog.js';
import getLogger from '../scripts/util/logger.js';
import sceneBrowserComponent from './scene-browser/scene-browser.js';

const tagName = 'studio-app';

const logger = getLogger(tagName);

class StudioApp extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(
      document.createElement(connectDialogComponent.tagName),
    );
    const sceneBrowser = document.createElement(sceneBrowserComponent.tagName);
    this.shadowRoot.appendChild(sceneBrowser);
  }

  connectedCallback() {
    logger.log(`connectedCallback`);
  }
}

customElements.define(tagName, StudioApp);
