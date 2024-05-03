import '../components/studio-app.js';
import { dataStore } from './state/constants.js';
import { store } from './state/store.js';

document.dispatchEvent(
  new CustomEvent(dataStore.STATE_UPDATED, {
    detail: { state: store.getState() },
  }),
);

// app controller init here
// main event listener/dispatcher .. copy redux? do what?
// needs some simple global state (connected/disconnected, playing/paused, ..?)
// global data store, how?
// components reactive from global store or holding their own?
// syncing with server for playback/writebacks
