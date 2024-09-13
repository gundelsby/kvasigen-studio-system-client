/**
 * @typedef {Object} PartParameter
 * @property {string} uuid - uuid
 * @property {string} name - parameter name
 * @property {string} type - data type for parameter
 * @property {string} [usedFor] - intended usage for parameter
 * @property {boolean} [canAutomate] - defines whether the parameter's value is static for the part or can be automated
 * @property {PartParameterValue[]} [values] - the parameter value
 *
 * @typedef {Object} PartParameterValue
 * @property {number} timecode - number of ms from start of script this value is at
 * @property {any} value - parameter value
 */

import getLogger from '../../../util/logger.js';
import { isValidUuid } from '../../uuid-helpers.js';

export {
  createPartParameterObject,
  isValidPartParameter,
  isValidPartParameterValue,
};

const logger = getLogger('model:demodata:script:parts:part-parameters');

/**
 * Creates a PartParamater object
 *
 * @param {object} data - parameter data
 * @returns {PartParameter}
 */
function createPartParameterObject(data) {
  if (!data || typeof data !== 'object') {
    const errorMessage =
      'Unable to create a valid part parameter using provided data (not an object)';
    logger.error(errorMessage, { data });
    throw new Error(errorMessage);
  }

  const uuid = self.crypto.randomUUID();
  const { name, type, usedFor, canAutomate } = data;
  const partParameter = Object.assign(
    {},
    { uuid, values: [] },
    { name, type, usedFor, canAutomate },
  );

  if (!isValidPartParameter(partParameter)) {
    const errorMessage =
      'Unable to create a valid part parameter using provided data';
    logger.error(errorMessage, { data });
    throw new Error(errorMessage);
  }

  return partParameter;
}

/**
 * Validator for PartParameter objects
 *
 * @param {*} obj - object to verify
 * @returns {boolean}
 */
function isValidPartParameter(obj) {
  if (!isValidUuid(obj?.uuid)) {
    return false;
  }

  if (!obj.name || typeof obj.name !== 'string') {
    return false;
  }

  if (!obj.type || typeof obj.type !== 'string') {
    return false;
  }

  if (
    obj.usedFor !== undefined &&
    (typeof obj.usedFor !== 'string' || obj.usedFor === '')
  ) {
    return false;
  }

  if (obj.canAutomate !== undefined && typeof obj.canAutomate !== 'boolean') {
    return false;
  }

  if (
    !Array.isArray(obj.values) ||
    !obj.values.every(isValidPartParameterValue)
  ) {
    return false;
  }

  return true;
}

/**
 * Checks if an object is a valid PartParameterValue
 *
 * @param {*} obj - object to check
 * @returns {boolean}
 */
function isValidPartParameterValue(obj) {
  if (!Number.isInteger(obj?.timecode) || obj.timecode < 0) {
    return false;
  }

  return obj.value !== undefined && obj.value !== null;
}
