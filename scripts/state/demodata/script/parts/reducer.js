import actionTypes from './action-types.js';
import getLogger from '../../../../util/logger.js';

const logger = getLogger('state:demodata:script:parts:reducer');

export default function partsReducer(parts = [], action) {
  switch (action.type) {
    case actionTypes.ADD_PART:
      parts.push(action.payload); //TODO: validate payload as part
      logger.log(`Added new part`, { newPart: parts.at(-1) });
      break;
    default:
    // skip unknown action type
  }

  return parts;
}
