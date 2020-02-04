const STATUS = {
  GOOD: 'good',
  IDLE: 'idle',
  WARNING: 'warning',
  ERROR: 'error'
};

const innerHTML = `<div>
<span class="message-text"></span> 
</div>`;

class StatusMessage extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = innerHTML;
  }
}

customElements.define('status-message', StatusMessage);
