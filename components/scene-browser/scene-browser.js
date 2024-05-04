import { dataStore } from '../../scripts/state/constants.js';
import getLogger from '../../scripts/util/logger.js';
import { html } from '../../../scripts/util/html.js';

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

    document.addEventListener(dataStore.STATE_UPDATED, (e) => {
      logger.log(`STATE_UPDATED`);
      stateUpdatedHandler(e, this);
    });

    logger.log('instanced');
  }

  connectedCallback() {
    logger.log('connected');
  }
}

customElements.define(tagName, SceneBrowser);

function stateUpdatedHandler(event, component) {
  const availableScenes = event?.detail?.state?.engineData?.availableScenes;

  if (
    JSON.stringify(availableScenes) ===
    JSON.stringify(component.availableScenes)
  ) {
    logger.log(`availableScenes unchanged, not updating item list`);
    return;
  }

  if (availableScenes) {
    component.availableScenes = availableScenes.slice();
    const ul = component.shadowRoot.querySelector('ul');
    ul.replaceChildren(
      ...component.availableScenes.map((scene) => {
        const li = document.createElement('li');
        li.classList.add(`${tagName}-item`);
        li.textContent = scene.id;

        return li;
      }),
    );

    logger.success(
      `availableScenes changed, item list updated`,
      component.availableScenes,
      component.shadowRoot,
    );
  }
}
