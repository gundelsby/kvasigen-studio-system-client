import getLogger from '../../util/logger.js';
import { html } from '../../../scripts/util/html.js';
import { store } from '../../state/store.js';

const tagName = 'scene-browser';

export default { tagName };

const logger = getLogger('components:SceneBrowser');

const innerHTML = html`<ul class="${tagName + '-itemlist'}"></ul>`;

class SceneBrowser extends HTMLElement {
  constructor() {
    super();

    this.availableScenes = [];
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = innerHTML;

    logger.log('instanced');
  }

  connectedCallback() {
    logger.log('connected');
    this.unSubscribeStore = store.subscribe(() => {
      this.stateUpdatedHandler();
    });
  }

  disconnectedCallback() {
    this.unSubscribeStore && this.unSubscribeStore();
  }

  stateUpdatedHandler() {
    const availableScenes = store.getState().engineData?.availableScenes;

    if (
      JSON.stringify(availableScenes) === JSON.stringify(this.availableScenes)
    ) {
      logger.log(`availableScenes unchanged, not updating item list`);
      return;
    }

    if (availableScenes) {
      this.availableScenes = availableScenes.slice();
      const ul = this.shadowRoot.querySelector('ul');
      ul.replaceChildren(
        ...this.availableScenes.map((scene) => {
          const li = document.createElement('li');
          li.classList.add(`${tagName}-item`);
          li.textContent = scene.id;

          return li;
        }),
      );

      logger.success(
        `availableScenes changed, item list updated`,
        this.availableScenes,
        this.shadowRoot,
      );
    }
  }
}

customElements.define(tagName, SceneBrowser);
