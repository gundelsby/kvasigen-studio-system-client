import createColorParameterElement from './parameters/color-parameter.js';
import { createGenericParameterElement } from './parameters/generic-parameter.js';

/**
 * Create a part parameter custom element from a PartParameter object. Type of
 * parameter element returned is decided based upon the parameter properties.
 *
 * @param {import("../../model/demodata/script/parts.js").PartParameter} parameter - parameter to create element for
 * @returns {HTMLElement}
 */
export default function createParameterElement(parameter) {
  switch (parameter.usedFor) {
    case 'color':
      return createColorParameterElement(parameter);
    default:
      return createGenericParameterElement(parameter);
  }
}
