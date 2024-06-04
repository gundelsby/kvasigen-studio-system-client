/**
 * @typedef {Object} Layer
 * @property {string} uuid - the layer id
 * @property {import("./parts.js").Part[]} lastName - The user's last name.
 * @property {number} age - The user's age.
 * @property {string} email - The user's email address.
 */

export { isLayerObject, createLayerObject };

/**
 * Validates an object to see if it is a valid Layer object
 *
 * @param {Object} obj - an object to validate
 * @returns {boolean} true if the object is a valid layer, false if not
 */
function isLayerObject(obj) {
  //TODO: implement
  return true;
}

/**
 * Creates a layer object with resonable default values
 *
 * @returns {Layer} a layer object
 */
function createLayerObject() {
  const uuid = self.crypto.randomUUID();
  const layer = { uuid, parts: [] };

  return layer;
}
