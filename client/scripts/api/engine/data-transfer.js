import createExportJson from '../demodata/export.js';
import noc from '../../network/noc.js';

export { exportDemoDataToEngine };

/**
 * Creates an export of the current demodata state and sends it to the engine
 */
function exportDemoDataToEngine() {
  const data = createExportJson();

  noc.sendMessageToEngine(data);
}
