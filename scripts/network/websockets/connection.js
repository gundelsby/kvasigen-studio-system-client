export default class WebSocketConnection {
  constructor() {}

  openEventHandler() {
    this.socket.send('Hello Server!');
    this.socket.removeEventListener('open', this.openEventHandler);
  }

  messageEventHandler(event) {
    console.log('Message from server ', event.data);
  }

  open(url) {
    if (this.socket) {
      throw new Error('Socket already open');
    }

    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', this.openEventHandler.bind(this));
    this.socket.addEventListener(
      'message',
      this.messageEventHandler.bind(this)
    );
    this.socket.addEventListener('error', console.log);
  }

  close() {
    if (!this.socket) {
      return; // no reason to care about closing a non open socket for now
    }

    this.socket.removeEventListener('message', this.messageEventHandler);
    this.socket.removeEventListener('error', console.log);

    this.socket.close(1000, 'kthnxbye!!');
  }
}
