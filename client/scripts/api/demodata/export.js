import { store } from '../../state/store.js';

/**
 * Creates a JSON object for export to the engine back end, representing the
 * current state of the demo data, including both the global data and the script.
 *
 * @return {object} the demo data as JSON
 */
export default function createExportJson() {
  const demoData = store.getState().demoData;

  const dataExport = {};

  // add global data
  dataExport.global = { ...demoData.global };

  dataExport.script = {
    layers: [],
    post: {},
  };
  // set up layers
  //  inline parts
  //    strip ids?
  //    inline parameters
  //      strip ids?

  return dataExport;
}
