import demoDataReducer from './demodata/reducer.js';
import engineDataReducer from './engineData/reducer.js';
import getLogger from '../util/logger.js';

const logger = getLogger('state:rootReducer');

export default function rootReducer(state = {}, action) {
  logger.log(`Handling ${action.type}`, { state, action });
  return {
    ...state,
    engineData: engineDataReducer(state.engineData, action),
    demoData: demoDataReducer(state.demoData, action),
  };
}
