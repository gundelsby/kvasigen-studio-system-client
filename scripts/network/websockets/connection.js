import getLogger from '../../util/logger.js';

const secretHandshake = {
  challenge: 'I would like to purchase your deadliest gun, please.',
  response: 'Aisle 6, next to the sympathy cards.',
};

const logger = getLogger('network:WebSocketConnection');

export default class WebSocketConnection {
  constructor() {
    this.handshakeChallengeSent = false;
    this.verifiedConnection = false;
  }

  openEventHandler() {
    logger.log(`Connection open`);

    this.socket.send(secretHandshake);
    this.handshakeChallengeSent = true;
    logger.log(`Secret handshake challenge sent`);

    this.socket.removeEventListener('open', this.openEventHandler);
  }

  messageEventHandler(event) {
    if (
      this.handshakeChallengeSent &&
      event.data === secretHandshake.response
    ) {
      this.verifiedConnection = true;
      logger.log(`Secret handshake response received, connection secure`);
    }

    logger.log('Message from server ', event.data);
  }

  sendJsonData(data) {
    if (!this.socket.OPEN) {
      logger.error(`Request to send JSON data, but socket is not open`);
      throw new Error(`Socket is not open, unable to send JSON data`);
    }

    const jsonData = JSON.stringify(data);
    this.socket.send(jsonData);
  }

  open(url) {
    if (this.socket) {
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
    this.socket.addEventListener('error', logger.error);
  }

  close() {
    if (!this.socket) {
      return; // no reason to care about closing a non open socket for now
    }

    this.socket.removeEventListener('message', this.messageEventHandler);
    this.socket.removeEventListener('error', logger.error);

    this.socket.close(1000, 'kthnxbye!!');
  }
}
