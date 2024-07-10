/**
 * @typedef {Object} Layer
 * @property {string} uuid - the layer id
 * @property {string} [name] - optional layer name
 * @property {import("./parts.js").Part[]} parts - the parts on this layer
 */

import { isValidPart } from './parts.js';
import { isValidUuid } from '../../uuid-helpers.js';

export { isLayerObject, createLayerObject };

/**
 * Validates an object to see if it is a valid Layer object
 *
 * @param {Object} obj - an object to validate
 * @returns {boolean} true if the object is a valid layer, false if not
 */
function isLayerObject(obj) {
  if (typeof obj !== 'object') {
    return false;
  }
  const { uuid, name, parts } = obj;

  if (!uuid || !isValidUuid(uuid)) {
    return false;
  }

  if (name && typeof name !== 'string') {
    return false;
  }

  if (!parts || !Array.isArray(parts) || parts.every(isValidPart)) {
    return false;
  }

  return true;
}

/**
 * Creates a layer object with resonable default values
 *
 * @param {Object} [props] - properties to use when creating the layer
 * @param {string} [props.name] - optional layer name
 * @param {string[]} [props.parts] - optional list of parts in this layer
 * @returns {Layer} a layer object
 */
function createLayerObject(props) {
  const uuid = self.crypto.randomUUID();
  const layer = { uuid, parts: [] };
  if (typeof props?.name === 'string') {
    layer.name = name;
  }
  if (Array.isArray(props?.parts)) {
    layer.parts.push(...props.parts);
  }

  return layer;
}
