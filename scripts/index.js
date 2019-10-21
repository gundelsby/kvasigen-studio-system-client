document.addEventListener('submit', (event) => {
  if (event.target.dataset && event.target.dataset.type === 'connect') {
    event.preventDefault();

    const form = event.target;
    try {
      const url = new URL(form.elements['url'].value);

      if (url.protocol !== 'ws:') {
        throw new Error('Only websocket connections allowed', url.href);
      }
      // Create WebSocket connection.
      const socket = new WebSocket(url);

      // Connection opened
      socket.addEventListener('open', function() {
        socket.send('Hello Server!');
      });

      // Listen for messages
      socket.addEventListener('message', function(event) {
        console.log('Message from server ', event.data);
      });

      socket.addEventListener('error', console.log);
    } catch (err) {
      console.log('fucked up setting up a connection', err);
    }
  }
});
