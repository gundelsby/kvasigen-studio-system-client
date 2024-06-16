export { isValidUuid };

/**
 * Validates a value to check if it is a valid uuid
 *
 * @param {*} uuid - the value to validate
 * @returns {boolean}
 */
function isValidUuid(uuid) {
  if (uuid?.length !== 36) {
    return false;
  }

  const parts = uuid.split('-');
  if (parts.length !== 5) {
    return false;
  }

  if (!parts.every(isHexString)) {
    return false;
  }

  return true;
}

function isHexString(str) {
  if (typeof str !== 'string') {
    return false;
  }

  return /^[a-fA-F0-9]+$/.test(str);
}
