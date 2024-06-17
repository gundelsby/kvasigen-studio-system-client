const tagName = 'ro-part-parameter';

export { tagName, createParameterElement };

class PartParameterComponent extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define(tagName, PartParameterComponent);

/**
 * Create a part parameter custom element from a PartParameter object
 *
 * @param {import("../../model/demodata/script/parts.js").PartParameter} parameter - parameter to create element for
 * @returns {HTMLElement}
 */
function createParameterElement(parameter) {
  const { name, type, usedFor, canAutomate } = parameter;

  const nameEl = document.createElement('p');
  nameEl.textContent = name;

  const el = document.createElement(tagName);
  el.append(nameEl);
  el.dataset.type = type;
  el.dataset.usedFor = usedFor;
  el.dataset.canAutomate = canAutomate;

  return el;
}
