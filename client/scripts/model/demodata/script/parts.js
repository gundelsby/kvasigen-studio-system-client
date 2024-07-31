/**
 * @typedef {Object} Part
 * @property {string} uuid - the part id
 * @property {string} id - the engine id of the scene type this part instantiates
 * @property {number} startsAt - part start time in ms from start of the demo
 * @property {number} endsAt - part end time in ms from start of the demo
 * @property {PartParameter[]} parameters - the parameters for this part
 *
 * @typedef {Object} PartParameter
 * @property {string} name - parameter name
 * @property {string} type - data type for parameter
 * @property {string} [usedFor] - intended usage for parameter
 * @property {boolean} [canAutomate] - defines whether the parameter's value is static for the part or can be automated
 * @property {any} [value] - the parameter value
 */

import getLogger from '../../../util/logger.js';
import { isValidUuid } from '../../uuid-helpers.js';

export { createPartObject, isValidPart };

const logger = getLogger('model:demodata:script:parts');

/**
 * Creates a Part object.
 *
 * @param {Object} data - part data
 * @returns {Part}
 */
function createPartObject(data) {
  const uuid = self.crypto.randomUUID();
  const part = Object.assign({}, { uuid, parameters: [] }, data);

  if (!isValidPart(part)) {
    const errorMessage = `Unable to create a valid part using provided data`;
    logger.error(errorMessage, {
      data,
    });
    throw new Error(errorMessage);
  }

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
    logger.warn(`Invalid part data (not an object)`, { data: obj });
    return false;
  }

  if (!isValidUuid(obj.uuid)) {
    logger.warn(`Invalid part data, missing or invalid uuid`, { data: obj });
    return false;
  }

  if (!Number.isInteger(obj.startsAt)) {
    logger.warn(
      `Invalid part data, missing or invalid part start time (${obj.startsAt})`,
      {
        data: obj,
      },
    );
    return false;
  }

  if (!Number.isInteger(obj.endsAt)) {
    logger.warn(
      `Invalid part data, missing or invalid part end time (${obj.endsAt})`,
      {
        data: obj,
      },
    );
    return false;
  }

  if (!Array.isArray(obj.parameters)) {
    logger.warn(`Invalid part data, missing or invalid parameters list`, {
      data: obj,
    });
    return false;
  }

  return true;
}
