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
 * Get all parts currently in the demo script
 *
 * @returns {[import('../../../model/demodata/script/parts.js').Part]} all parts in the current script
 */
function getParts() {
  return store.getState().demoData.script.parts.slice();
}
