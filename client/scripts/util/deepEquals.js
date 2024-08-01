/**
 * Deep equals comparison of two objects
 *
 * @param {any} obj1
 * @param {any} obj2
 * @returns {boolean} true if equal, false if unequal
 */
export default function areDeepEquals(obj1, obj2) {
  if (obj1 === obj2) {
    return true; // takes care of primitives and comparison of an object with itself
  }

  if (!isObject(obj1) || !isObject(obj2)) {
    return false;
  }

  const obj1Keys = Object.keys(obj1);
  if (obj1Keys.length !== Object.keys(obj2).length) {
    return false;
  }

  for (const key of obj1Keys) {
    if (!areDeepEquals(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function isObject(obj) {
  return !!obj && typeof obj === 'object';
}
