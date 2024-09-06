/**
 * @typedef {Object} PartParameter
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

export { createPartParameterObject, isValidPartParameter };

/**
 * Creates a PartParamater object
 *
 * @param {object} data - parameter data
 * @returns {PartParameter}
 */
function createPartParameterObject(data) {
  if (!data || typeof data !== 'object') {
    throw new Error(`Invalid input, not an object`);
  }

  const uuid = self.crypto.randomUUID();
  const { name, type, usedFor, canAutomate } = data;
  const partParameter = Object.assign(
    {},
    { uuid, values: [] },
    { name, type, usedFor, canAutomate },
  );

  return partParameter;
}

/**
 * Validator for PartParameter objects
 *
 * @param {*} obj - object to verify
 * @returns {boolean}
 */
function isValidPartParameter(obj) {
  return true;
}
