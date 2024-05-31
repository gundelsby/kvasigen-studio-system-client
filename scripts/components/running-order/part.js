const tagName = `ro-part`;

export default { tagName };

class Part extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.uuid = this.dataset.uuid;
  }
}

customElements.define(tagName, Part);
