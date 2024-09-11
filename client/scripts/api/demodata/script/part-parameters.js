import actionTypes from '../../../state/action-types.js';
import { createPartParameterObject } from '../../../model/demodata/script/part-parameters.js';
import { store } from '../../../state/store.js';

export { createPartParameter, updatePartParameterValues };

/**
 * Create a part parameter object and add it to the data store
 *
 * @param {Object} data - input data to create part parameter from
 * @returns {import('../../../model/demodata/script/part-parameters.js').PartParameter}
 */
function createPartParameter(data) {
  const partParameter = createPartParameterObject(data);
  store.dispatch({
    type: actionTypes.demodata.script.parts.parameters.ADD_PART_PARAMETER,
    payload: partParameter,
  });

  return partParameter;
}

/**
 * Update values for an existing part parameter datastore object
 *
 * @param {string} uuid
 * @param {import('../../../model/demodata/script/part-parameters.js').PartParameterValue[l]} values
 */
function updatePartParameterValues(uuid, values) {
  store.dispatch({
    type: actionTypes.demodata.script.parts.parameters
      .UPDATE_PART_PARAMETER_VALUES,
    payload: { uuid, values },
  });
}
