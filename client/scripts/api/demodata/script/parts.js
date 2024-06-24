import actionTypes from '../../../state/action-types.js';
import { createPartObject } from '../../../model/demodata/script/parts.js';
import { store } from '../../../state/store.js';

export default { createPart, getPart, getParts };

function createPart(data) {
  const part = createPartObject(data);
  store.dispatch({
    type: actionTypes.demodata.script.parts.ADD_PART,
    payload: part,
  });

  return part;
}

/**
 * Get a part from its uuid.
 *
 * @param {string} uuid - the uuid of the part to search
 * @returns {import('../../../model/demodata/script/parts.js').Part|null} the part if found, or null
 */
function getPart(uuid) {
  return store.getState().demoData.script.parts.find((p) => p.uuid === uuid);
}

/**
 * Get parts currently in the demo script, optionally matching a set of query parameters.
 * If no query parameters are given it will return all parts.
 *
 * @param {object} [queryParams]
 * @param {import('../../../model/demodata/script/parts.js').Part} [queryParams.partProps]
 *
 * @returns {[import('../../../model/demodata/script/parts.js').Part]} the matching parts
 */
function getParts(queryParams) {
  const parts = store.getState().demoData.script.parts.slice();
  if (!queryParams?.partProps) {
    return parts;
  }

  return parts.filter((part) => {
    const { partProps } = queryParams;
    for (const propName in partProps) {
      if (part[propName] !== partProps[propName]) {
        return false;
      }
    }

    return true;
  });
}
