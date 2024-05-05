import getLogger from '../util/logger.js';

export default engineMessageHandler;

const logger = getLogger('messaging:engineMessageHandler');

const messageTypes = {
  engineInfo: 'engineInfo',
};

function engineMessageHandler(message) {
  const { type, data } = message;
  switch (type) {
    case messageTypes.engineInfo:
      logger.log(`Received engine info message`, data);
      break;
    default:
      logger.warn(`Received unknown server message`, { type, data });
  }
}
