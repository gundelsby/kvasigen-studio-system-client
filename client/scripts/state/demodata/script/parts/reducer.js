import actionTypes from './action-types.js';
import { createPartObject } from '../../../../model/demodata/script/parts.js';
import getLogger from '../../../../util/logger.js';

const logger = getLogger('state:demodata:script:parts:reducer');

export default function partsReducer(parts = [], action) {
  switch (action.type) {
    case actionTypes.ADD_PART:
      try {
        parts.push(createPartObject(action.payload));
        logger.log(`Added new part`, { newPart: parts.at(-1) });
      } catch (error) {
        logger.error(`Unable to add new part`, {
          payload: action.payload,
          error,
        });
      }
      break;
    default:
    // skip unknown action type
  }

  return parts;
}
