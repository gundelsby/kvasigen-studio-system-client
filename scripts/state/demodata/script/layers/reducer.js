import actionTypes from './action-types.js';
import getLogger from '../../../../util/logger.js';

const logger = getLogger('state:demodata:script:layers:reducer');

export default function layersReducer(layers = [], action) {
  switch (action.type) {
    case actionTypes.ADD_LAYER:
      layers.push(action.payload); //TODO: validate data as layer
      logger.log(`Added new layer to demo script`, { layers: layers.at(-1) });
      break;
    default:
    // unknown action, do nothing
  }

  return layers;
}
