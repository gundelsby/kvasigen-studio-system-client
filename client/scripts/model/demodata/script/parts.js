/**
 * @typedef {Object} Part
 * @property {string} uuid - the part id
 * @property {string} id - the engine id of the scene type this part instantiates
 * @property {PartParameter[]} parameters - the parameters for this part
 *
 * @typedef {Object} PartParameter
 * @property {string} name - parameter name
 * @property {string} type - data type for parameter
 * @property {string} [usedFor] - intended usage for parameter
 * @property {boolean} [canAutomate] - defines whether the parameter's value is static for the part or can be automated
 */

import { isValidUuid } from '../../uuid-helpers.js';

export { createPartObject, isValidPart };

/**
 * Creates a Part object.
 *
 * @param {Object} data - part data
 * @returns {Part}
 */
function createPartObject(data) {
  const uuid = self.crypto.randomUUID();
  const part = { uuid, ...data };

  return part;
}

/**
 * Validator for Part objects
 *
 * @param {*} obj
 * @returns {boolean}
 */
function isValidPart(obj) {
  if (typeof obj !== 'object') {
    return false;
  }

  if (!isValidUuid(obj.uuid)) {
    return false;
  }

  return true;
}
