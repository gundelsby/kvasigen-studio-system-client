import { createPartParameterObject } from '../../../model/demodata/script/part-parameters.js';
import actionTypes from '../../../state/action-types.js';
import { store } from '../../../state/store.js';

function createPartParameter(data) {
  const partParameter = createPartParameterObject(data);
  store.dispatch({
    type: actionTypes.demodata.script.parts.parameters.ADD_PART_PARAMETER,
    payload: partParameter,
  });

  return partParameter;
}

/**
 *
 * @param {string} uuid
 * @param {import('../../../model/demodata/script/part-parameters.js').PartParameterValue[]} values
 */
function updatePartParameterValues(uuid, values) {
  store.dispatch({
    type: actionTypes.demodata.script.parts.parameters
      .UPDATE_PART_PARAMETER_VALUES,
    payload: { uuid, values },
  });
}
