const innerHTML = `<div>
  This is the transport bar!
</div>`;

class TransportBar extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = innerHTML;
  }
}

customElements.define('transport-bar', TransportBar);
