import WebSocketConnection, { EventTypes } from './websockets/connection.js';
import engineMessageHandler from '../messaging/engine-message-handler.js';
import getLogger from '../util/logger.js';

const logger = getLogger('network:noc');

export const EVENT_NAMES = {
  ENGINE_CONNECTED: 'noc-connected-to-engine',
  ENGINE_DISCONNECTED: 'noc-disconnected-from-engine',
};

function createNetworkOperationsCentre() {
  let engineConnection = null;

  return {
    openEngineConnection: (url) => {
      if (engineConnection && engineConnection.isOpen()) {
        logger.warn(
          `Trying to open a connection to the engine, but there is already an open connection.`,
        );
        return;
      }

      // Create WebSocket connection.
      engineConnection = new WebSocketConnection((message) =>
        engineMessageHandler(message),
      );
      engineConnection.addEventListener(EventTypes.CONNECTION_OPEN, () => {
        logger.success(`Engine connection opened`);
        document.dispatchEvent(
          new CustomEvent(EVENT_NAMES.ENGINE_CONNECTED, { detail: { url } }),
        );
      });

      engineConnection.addEventListener(EventTypes.CONNECTION_CLOSED, () => {
        logger.log(`Engine connection closed`);
        document.dispatchEvent(
          new CustomEvent(EVENT_NAMES.ENGINE_DISCONNECTED),
        );
      });

      engineConnection.open(url);
      logger.log(`Opening engine connection`);
    },
    closeEngineConnection: () => {
      if (engineConnection && engineConnection.isOpen()) {
        engineConnection.close();
        logger.log(`Closing engine connection`);
        return;
      }

      logger.warn(`Unable to close an non-open connection`);
    },
    sendMessageToEngine(data) {
      if (!engineConnection || !engineConnection.isOpen()) {
        const message = `Unable to send message to engine, connection is not open`;
        logger.error(message);
        throw new Error(message);
      }

      engineConnection.sendJsonData(data);
    },
  };
}

const noc = createNetworkOperationsCentre();

export default noc;
