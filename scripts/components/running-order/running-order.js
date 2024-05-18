import getLogger from '../../util/logger.js';
import { html } from '../../util/html.js';

const tagName = 'running-order';

const classNames = {
  DROP_TARGET: 'drop-target',
};

export default { tagName };

const logger = getLogger(`components:${tagName}`);

// scene instances goes here
const content = html`<section class="running-order">
  <div class="${classNames.DROP_TARGET}">
    Drop scenes here to add to running order
  </div>
</section>`;

class RunningOrder extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = content;

    this.tracks = [];
  }

  connectedCallback() {
    logger.log(`Connected`);

    this.addEventListener('drop', this.dropHandler.bind(this));
    this.addEventListener('dragover', this.dragoverHandler.bind(this));
  }

  dragoverHandler(event) {
    event.preventDefault();
  }

  dropHandler(event) {
    event.preventDefault();

    try {
      const { dataTransfer } = event;
      if (!dataTransfer) {
        logger.error(
          `No dataTransfer prop in drop event, unable to process drop`,
        );
        return;
      }

      const data = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (typeof data.scene === 'object') {
        this.addScene(data.scene);
      }
    } catch (err) {
      logger.error(`Unable to process drop event`, { err });
    }
  }

  addScene(scene) {
    // this should all be converted to state/store-based logic
    this.addTrack(scene);
    logger.log(`Added new scene to running order`, { ...scene });
  }

  addTrack(...scenes) {
    // this should all be converted to state/store-based logic

    this.tracks.push({ parts: [...scenes] });
    console.log(
      `Added new track to running order, number of tracks in running order is now: ${this.tracks.length}`,
    );
  }
}

customElements.define(tagName, RunningOrder);
