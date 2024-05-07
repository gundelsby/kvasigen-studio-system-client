import getLogger from '../../util/logger.js';

const secretHandshake = {
  challenge: `I'd like to buy your deadliest gun, please.`,
  response: 'Aisle 6, next to the sympathy cards.',
};

export const EventTypes = {
  CONNECTION_OPEN: 'websocketconnection-open',
  CONNECTION_CLOSED: 'websocketconnection-closed',
};

const logger = getLogger('network:WebSocketConnection');

export default class WebSocketConnection extends EventTarget {
  constructor(engineMessageHandler) {
    super();

    this.handshakeChallengeSent = false;
    this.verifiedConnection = false;
    this.engineMessageHandler = engineMessageHandler;
  }

  openEventHandler() {
    logger.log(`Connection open`);

    this.socket.removeEventListener('open', this.openEventHandler);
    this.dispatchEvent(new CustomEvent(EventTypes.CONNECTION_OPEN));

    this.socket.send(secretHandshake.challenge);
    this.handshakeChallengeSent = true;
    logger.log(`Secret handshake challenge sent`);
  }

  messageEventHandler(event) {
    if (
      this.handshakeChallengeSent &&
      event.data === secretHandshake.response
    ) {
      this.verifiedConnection = true;
      logger.log(`Secret handshake response received, connection secure`);
      this.handshakeChallengeSent = false;
      return;
    }

    try {
      const jsonData = JSON.parse(event.data);
      logger.log('Message from server ', jsonData);
      this.engineMessageHandler(jsonData);
    } catch (e) {
      logger.error(`Unable to process server message data`, { error: e });
    }
  }

  sendJsonData(data) {
    if (!this.isOpen()) {
      logger.error(`Request to send JSON data, but socket is not open`);
      throw new Error(`Socket is not open, unable to send JSON data`);
    }

    const jsonData = JSON.stringify(data);
    this.socket.send(jsonData);
  }

  open(url) {
    if (this.isOpen()) {
      logger.error(
        `Attempted to open connection to ${url}, but connection is already open to ${this.socket.url}`,
      );
      throw new Error('Connection already open');
    }

    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', this.openEventHandler.bind(this));
    this.socket.addEventListener(
      'message',
      this.messageEventHandler.bind(this),
    );
    this.socket.addEventListener(
      'error',
      this.connectionErrorHandler.bind(this),
    );
  }

  connectionErrorHandler(event) {
    logger.error(`Connection error, closing socket`, { error: event });
    this.close();
  }

  close() {
    if (!this.socket) {
      return; // no reason to care about closing a non open socket for now
    }

    this.socket.removeEventListener('message', this.messageEventHandler);
    this.socket.removeEventListener('error', this.connectionErrorHandler);

    this.socket.close(1000, 'kthnxbye!!');
    this.dispatchEvent(new CustomEvent(EventTypes.CONNECTION_CLOSED));

    logger.log(`Connection closed`);
  }

  isOpen() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}
