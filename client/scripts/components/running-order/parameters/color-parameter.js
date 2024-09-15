import {
  getPartParameter,
  updatePartParameterValues,
} from '../../../api/demodata/script/part-parameters.js';
import { getStyleTag } from './color-parameter-styles.js';
import { html } from '../../../util/syntax-helpers.js';
import { store } from '../../../state/store.js';

export { tagName };

const tagName = 'part-color-parameter';
const defaultColorValue = { r: 122, g: 73, b: 11, a: 255 };
const classNames = {
  NAME: 'name',
};

const elementNames = {
  COLOR_INPUT: 'color-input',
};

const template = (name, valueString) => {
  return html`<p>
    <span class="${classNames.NAME}">${name}</span>
    <input
      type="color"
      name="${elementNames.COLOR_INPUT}"
      value="${valueString}"
    />
  </p>`;
};

//TODO: handle canAutomate=true
customElements.define(
  tagName,
  class ColorParameter extends HTMLElement {
    constructor() {
      super();

      /** @type function[] */
      this.unsubscribeCallbacks = [];

      this.attachShadow({ mode: 'open' });
      this.contentRoot = document.createElement('div');
    }

    connectedCallback() {
      this.uuid = this.dataset.uuid;
      const { name, type, canAutomate, usedFor, values } = getPartParameter(
        this.uuid,
      );
      this.name = name;
      this.type = type;
      this.canAutomate = canAutomate || false;
      this.usedFor = usedFor;
      this.values = values;
      if (!this.values[0]) {
        this.values.push({ timecode: 0, value: defaultColorValue });
      }

      this.shadowRoot.append(
        getStyleTag(this.values[0].value),
        this.contentRoot,
      );

      this.contentRoot.innerHTML = template(
        `${this.name} (${this.usedFor} ${this.type})`,
        rgbToInputValueString(this.values[0].value),
      );
      this.shadowRoot
        .querySelector(`input[name="${elementNames.COLOR_INPUT}"]`)
        .addEventListener('change', this.changeUpdateHandler.bind(this));

      this.unsubscribeCallbacks.push(
        store.subscribe(this.getDataFromStore.bind(this)),
      );
    }

    disconnectedCallback() {
      for (const unsub of this.unsubscribeCallbacks) {
        unsub();
      }
    }

    /**
     * @param {Event} event
     */
    changeUpdateHandler(event) {
      const { value } = event.target;

      //TODO: add alpha channel when type dictates it (eg. vec4)
      this.values[0].value = value;
      //TODO: update border-color css prop
      updatePartParameterValues(this.uuid, this.values.slice());
    }

    getDataFromStore() {
      //TODO: implement
    }
  },
);

function rgbToInputValueString({ r, g, b }) {
  const rString = r > 0x0f ? r.toString(16) : `0${r.toString(16)}`;
  const gString = g > 0x0f ? g.toString(16) : `0${g.toString(16)}`;
  const bString = b > 0x0f ? b.toString(16) : `0${b.toString(16)}`;

  return `#${rString}${gString}${bString}`;
}
