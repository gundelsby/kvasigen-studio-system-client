import engineDataActionTypes from './action-types.js';
import getLogger from '../../util/logger.js';

const logger = getLogger('state:engineData:reducer');

export default function (state, action) {
  switch (action.type) {
    case engineDataActionTypes.ENGINE_INFO_SERVER_UPDATE:
      state = action.payload;
      logger.log(`Handled ${action.type}`);
      break;
    default:
      logger.log(`Unknown action type ${action.type}`);
  }

  return state;
}
