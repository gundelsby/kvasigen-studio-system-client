import actionTypes from '../../../state/action-types.js';
import { createPartObject } from '../../../model/demodata/script/parts.js';
import { store } from '../../../state/store.js';

export default { createPart };

function createPart(data) {
  const part = createPartObject(data);
  store.dispatch({
    type: actionTypes.demodata.script.parts.ADD_PART,
    payload: part,
  });
}
