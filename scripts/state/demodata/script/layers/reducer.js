import actionTypes from './action-types.js';
import { createLayerObject } from '../../../../model/demodata/script/layers.js';
import getLogger from '../../../../util/logger.js';

const logger = getLogger('state:demodata:script:layers:reducer');

export default function layersReducer(layers = [], action) {
  switch (action.type) {
    case actionTypes.ADD_LAYER:
      try {
        layers.push(createLayerObject(action.payload));
        logger.log(`Added new layer to demo script`, { layers: layers.at(-1) });
      } catch (error) {
        logger.error(`Unable to add new layer to demoscript`, { error });
      }
      break;
    default:
    // unknown action, do nothing
  }

  return layers;
}
