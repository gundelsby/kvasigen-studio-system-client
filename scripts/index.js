import '../components/studio-app.js';
import noc, { EVENT_NAMES } from './network/noc.js';
import { dataStore } from './state/constants.js';
import getLogger from './util/logger.js';
import { store } from './state/store.js';

const logger = getLogger(`index.js`);

document.addEventListener(EVENT_NAMES.ENGINE_CONNECTED, () => {
  logger.log(`Engine connected, requesting engine info...`);
  noc.sendMessageToEngine({ type: 'requestEngineInfo' });
});

logger.success(`Script initalized`);

// app controller init here
// main event listener/dispatcher .. copy redux? do what?
// needs some simple global state (connected/disconnected, playing/paused, ..?)
// global data store, how?
// components reactive from global store or holding their own?
// syncing with server for playback/writebacks
