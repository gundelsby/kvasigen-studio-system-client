/**
 * @typedef {Object} Part
 * @property {string} uuid - the part id
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
