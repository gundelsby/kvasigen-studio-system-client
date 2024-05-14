import '../components/studio-app.js';
import noc, { EVENT_NAMES } from './network/noc.js';
import getLogger from './util/logger.js';

const logger = getLogger(`index.js`);

document.addEventListener(EVENT_NAMES.ENGINE_CONNECTED, () => {
  logger.log(`Engine connected, requesting engine info...`);
  noc.sendMessageToEngine({ type: 'requestEngineInfo' });
});

logger.success(`Script initalized`);
