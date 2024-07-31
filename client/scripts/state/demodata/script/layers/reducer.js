import actionTypes from './action-types.js';
import { createLayerObject } from '../../../../model/demodata/script/layers.js';
import getLogger from '../../../../util/logger.js';

const logger = getLogger('state:demodata:script:layers:reducer');

/**
 * Reducer for layers
 *
 * @param {import('../../../../model/demodata/script/layers.js').Layer[]} layers
 * @param {object} action
 * @returns
 */
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
    case actionTypes.ADD_PART_TO_LAYER:
      try {
        addPartToLayer(action.payload, layers);
      } catch (error) {
        logger.error(`Unable to add part to layer`, { error });
      }
      break;
    default:
    // unknown action, do nothing
  }

  return layers;
}

/**
 * Add a part to a layer
 *
 * @param {object} ids
 * @param {string} ids.layerId
 * @param {string} ids.partId
 * @param {import('../../../../model/demodata/script/layers.js').Layer[]} layers
 */
function addPartToLayer({ layerId, partId }, layers) {
  const layer = layers.find(({ uuid }) => uuid === layerId);
  if (!layer) {
    throw new Error(`There is no layer with id ${layerId}`);
  }

  if (layer.parts.includes(partId)) {
    logger.warn(
      `Trying to add part ${partId} to layer ${layerId}, but part already exists on layer`,
    );
    return;
  }

  layer.parts.push(partId);
}
