import { css, html } from '../../../util/syntax-helpers.js';

const tagName = 'part-color-parameter';
const defaultColorValue = { r: 122, g: 73, b: 11, a: 255 };
/**
 *
 * @param {import('../../../model/demodata/script/parts.js').PartParameter} param
 * @returns {HTMLElement}
 */
export default function createColorParameterElement(param) {
  //TODO: value -> values, create paramater in datastore via API, only use data-uuid in factory function

  const el = document.createElement(tagName);
  el.dataset.name = param.name;
  if (param.value) {
    el.dataset.value = JSON.stringify(param.value);
  }

  return el;
}

const template = (name, { r, g, b }) => {
  const rString = r > 0x0f ? r.toString(16) : `0${r.toString(16)}`;
  const gString = g > 0x0f ? g.toString(16) : `0${g.toString(16)}`;
  const bString = b > 0x0f ? b.toString(16) : `0${b.toString(16)}`;

  const valueString = `#${rString}${gString}${bString}`;

  return html`<p>
    <span class="name">${name}</span>
    <input type="color" name="color" value="${valueString}" />
  </p>`;
};

const styles = ({ r, g, b }) => css`
  :host {
    .name {
    }

    input[type='color' i] {
      border-radius: 50%;
      inline-size: 30px;
      block-size: 30px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(${r}, ${g}, ${b});
      padding: 1px;
    }

    input[type='color' i]::-webkit-color-swatch-wrapper {
      padding: 1px;
    }

    input[type='color' i]::-webkit-color-swatch,
    input[type='color' i]::-moz-color-swatch {
      border-radius: 50%;
    }
  }
`;

/**
 * Generate styles based on parameter value
 *
 * @param {{r:number, g:number, b:number, a:number}} rgbaValue
 * @returns
 */
function getStyleTag(rgbaValue) {
  const tag = document.createElement('style');
  tag.textContent = styles(rgbaValue);
  return tag;
}

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
      this.contentRoot.innerHTML = template(this.name, this.value);
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
