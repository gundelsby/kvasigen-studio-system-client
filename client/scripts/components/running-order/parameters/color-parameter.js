import { css, html } from '../../../util/syntax-helpers.js';

const tagName = 'part-color-parameter';
const defaultColorValue = { r: 122, g: 73, b: 11, a: 255 };
/**
 *
 * @param {import('../../../model/demodata/script/parts.js').PartParameter} param
 * @returns {HTMLElement}
 */
export default function createColorParameterElement(param) {
  const el = document.createElement(tagName);
  el.dataset.name = param.name;
  if (param.value) {
    el.dataset.value = JSON.stringify(param.value);
  }

  return el;
}

const template = (name) =>
  html`<p>
      <span class="name">${name}</span>
    </p>
    <dialog>
      <p>color editor lol</p>
    </dialog> `;

const styles = ({ r, g, b }) => css`
  :host {
    .name {
      &::after {
        background-color: rgb(${r} ${g} ${b});
        border-radius: 50%;
        content: '';
        display: inline-block;
        margin-left: 8px;
        height: 1em;
        width: 1em;
      }
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

class ColorParameter extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.contentRoot = document.createElement('div');
  }

  connectedCallback() {
    this.name = this.dataset.name;
    this.value = this.dataset.value
      ? JSON.parse(this.dataset.value)
      : defaultColorValue;
    this.contentRoot.innerHTML = template(this.name);
    this.shadowRoot.append(getStyleTag(this.value), this.contentRoot);

    this.dialog = this.shadowRoot.querySelector('dialog');
    this.dialogTrigger = this.shadowRoot.querySelector('p');

    this.dialogTrigger.addEventListener('click', () => this.dialog.showModal());
  }
}

customElements.define(tagName, ColorParameter);
