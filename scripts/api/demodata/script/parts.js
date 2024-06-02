import actionTypes from '../../../state/action-types.js';
import { store } from '../../../state/store.js';

export default { createPart };

function createPart(data) {
  const uuid = self.crypto.randomUUID();
  const part = { uuid, ...data };
  store.dispatch({
    type: actionTypes.demodata.script.parts.ADD_PART,
    payload: part,
  });

  return part;
}
