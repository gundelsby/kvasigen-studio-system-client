import '../components/studio-app.js';
import { dataStore } from './state/constants.js';
import getLogger from './util/logger.js';
import { store } from './state/store.js';

const logger = getLogger(`index.js`);

document.dispatchEvent(
  new CustomEvent(dataStore.STATE_UPDATED, {
    detail: { state: store.getState() },
  }),
);

document.addEventListener('click', (ev) => {
  const h1 = document.querySelector('h1');
  if (ev.target === h1) {
    document.dispatchEvent(
      new CustomEvent(dataStore.STATE_UPDATED, {
        detail: { state: store.getState() },
      }),
    );
  }
});

logger.success(`Script initalized`);

// app controller init here
// main event listener/dispatcher .. copy redux? do what?
// needs some simple global state (connected/disconnected, playing/paused, ..?)
// global data store, how?
// components reactive from global store or holding their own?
// syncing with server for playback/writebacks
