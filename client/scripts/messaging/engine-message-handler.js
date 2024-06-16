import engineDataActionTypes from '../state/engineData/action-types.js';
import getLogger from '../util/logger.js';
import { store } from '../state/store.js';

export default engineMessageHandler;

const logger = getLogger('messaging:engineMessageHandler');

const messageTypes = {
  engineInfo: 'engineInfo',
};

function engineMessageHandler(message) {
  const { type, data } = message;
  switch (type) {
    case messageTypes.engineInfo:
      logger.log(`Received engine info message (typeof ${typeof data})`, data);
      logger.log(`Keys in engineInfo object: ${Object.keys(data).join(', ')}`);
      store.dispatch({
        type: engineDataActionTypes.ENGINE_INFO_SERVER_UPDATE,
        payload: data,
      });
      break;
    default:
      logger.warn(`Received unknown server message`, { type, data });
  }
}
