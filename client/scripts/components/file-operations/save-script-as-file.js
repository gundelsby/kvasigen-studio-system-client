import api from '../../api/api.js';
import { html } from '../../util/syntax-helpers.js';

const tagName = `file-operations-save-script-file`;

const template = (url) => html`
  <div>
    <a download="${url}">Save script as file</a>
  </div>
`;

customElements.define(
  tagName,
  class SaveScriptAsFile extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = template(null);
      this.anchor = this.shadowRoot.querySelector('a');
    }

    connectedCallback() {
      this.anchor.addEventListener('click', () => {
        if (!this.anchor.getAttribute('download')) {
          const json = api.demodata.createExportJson();
          const url = URL.createObjectURL(new Blob([JSON.stringify(json)]), {
            type: 'application/json',
          });
          this.anchor.setAttribute('download', url);
          this.anchor.click();
        } else {
          setTimeout(() => {
            const url = this.anchor.getAttribute('download');
            this.anchor.setAttribute('download', '');
            URL.revokeObjectURL(url);
          }, 1000);
        }
      });
    }
  },
  {},
);
