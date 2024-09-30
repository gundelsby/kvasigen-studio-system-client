import api from '../../api/api.js';
import { html } from '../../util/syntax-helpers.js';

const tagName = `file-operations-save-script-file`;

const template = html`
  <div>
    <button>Save script as file</button>
  </div>
`;

customElements.define(
  tagName,
  class SaveScriptAsFile extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = template;
      this.button = this.shadowRoot.querySelector('button');
    }

    connectedCallback() {
      this.button.addEventListener('click', () => {
        const json = api.demodata.createExportJson();
        const url = URL.createObjectURL(new Blob([JSON.stringify(json)]), {
          type: 'application/json',
        });

        const filename = `${getFormattedNowDateTime()}-${json.global.title}.json`;

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();

        URL.revokeObjectURL(anchor.href);
      });
    }
  },
  {},
);

function getFormattedNowDateTime() {
  const iso = new Date().toISOString();

  return `${iso.substring(0, 10)}-${iso.substring(11, 23)}`;
}
