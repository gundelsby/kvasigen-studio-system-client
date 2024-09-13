import { getStyleTag } from './color-parameter-styles.js';
import { html } from '../../../util/syntax-helpers.js';

export { tagName };

const tagName = 'part-color-parameter';
const defaultColorValue = { r: 122, g: 73, b: 11, a: 255 };

const template = (name, valueString) => {
  return html`<p>
    <span class="name">${name}</span>
    <input type="color" name="color" value="${valueString}" />
  </p>`;
};

customElements.define(
  tagName,
  class ColorParameter extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      this.contentRoot = document.createElement('div');
    }

    connectedCallback() {
      this.name = this.dataset.name;
      this.value = this.dataset.value ?? defaultColorValue;
      this.contentRoot.innerHTML = template(
        this.name,
        rgbToInputValueString(this.value),
      );
      this.shadowRoot.append(getStyleTag(this.value), this.contentRoot);

      this.shadowRoot
        .querySelector('input[type=color]')
        .addEventListener('change', this.changeUpdateHandler.bind(this));
    }

    /**
     * @param {Event} event
     */
    changeUpdateHandler(event) {
      const { value } = event.target;

      this.dataset.value = value;
    }
  },
);

function rgbToInputValueString({ r, g, b }) {
  const rString = r > 0x0f ? r.toString(16) : `0${r.toString(16)}`;
  const gString = g > 0x0f ? g.toString(16) : `0${g.toString(16)}`;
  const bString = b > 0x0f ? b.toString(16) : `0${b.toString(16)}`;

  return `#${rString}${gString}${bString}`;
}
