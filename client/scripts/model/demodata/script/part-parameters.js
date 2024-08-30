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

function createPartParameterObject(data) {}
