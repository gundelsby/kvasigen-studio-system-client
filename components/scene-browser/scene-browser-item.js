//https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots
import html from '../../scripts/util/html.js';

export const template = html` <li is="scene-browser-item"></li> `;

class SceneBrowserItem extends HTMLLIElement {}

window.customElements.define('scene-browser-item', SceneBrowserItem, {
  extends: 'li',
});
