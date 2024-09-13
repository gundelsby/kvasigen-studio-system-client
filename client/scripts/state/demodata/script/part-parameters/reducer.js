import actionTypes from './action-types.js';
import { createPartParameterObject } from '../../../../model/demodata/script/part-parameters.js';
import getLogger from '../../../../util/logger.js';

const logger = getLogger('state:demodata:script:parts:part-parameters:reducer');

/**
 * Part parameters reducer
 *
 * @param {import("../../../../model/demodata/script/part-parameters.js").PartParameter[]} partParameters
 * @param {object} action - the action to process
 * @param {string} action.type - action type
 * @param {object} action.payload - action payload
 * @returns {import('../../../../model/demodata/script/part-parameters.js').PartParameter[]}
 */
export default function partParametersReducer(partParameters = [], action) {
  switch (action.type) {
    case actionTypes.ADD_PART_PARAMETER:
      try {
        partParameters.push(
          action.payload.uuid
            ? action.payload
            : createPartParameterObject(action.payload),
        );
        logger.log('Added new part parameter', {
          partParameter: partParameters.at(-1),
        });
      } catch (error) {
        logger.error('Unable to add new part', {
          payload: action.payload,
          error,
        });
      }
      break;
    case actionTypes.UPDATE_PART_PARAMETER_VALUES:
      try {
        partParameters.find((p) => p.uuid === action.payload.uuid).values =
          action.payload.values;
      } catch (error) {
        logger.error('Unable to update part parameter values', {
          payload: action.payload,
          error,
        });
      }
      break;
    default:
    // skip unknown action type
  }

  return partParameters;
}
