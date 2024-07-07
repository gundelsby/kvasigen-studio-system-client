import actionTypes from '../../../state/action-types.js';
import { createLayerObject } from '../../../model/demodata/script/layers.js';
import partsApi from './parts.js';
import { store } from '../../../state/store.js';

export default { createLayerWithParts, createLayer, getLayer, getLayers };

function createLayerWithParts({ parts = [] }) {
  const layer = createLayerObject();

  for (const part of parts) {
    part.layer = layer.uuid;

    if (part.uuid) {
      layer.parts.push({ uuid: part.uuid });
    } else {
      const { uuid } = partsApi.createPart(part);
      layer.parts.push(uuid);
    }
  }

  store.dispatch({
    type: actionTypes.demodata.script.layers.ADD_LAYER,
    payload: layer,
  });

  return layer;
}

function createLayer() {
  const layer = createLayerObject();

  store.dispatch({
    type: actionTypes.demodata.script.layers.ADD_LAYER,
    payload: layer,
  });

  return layer;
}

/**
 * Get a layer by it's unique id. Returns null if not found
 *
 * @param {string} uuid - uuid of the layer to get
 * @returns {import('../../../model/demodata/script/layers.js').Layer|null}
 */
function getLayer(uuid) {
  return (
    store.getState().demoData.script.layers.find((l) => l.uuid === uuid) ?? null
  );
}

/**
 * Get all layers in the current demo script
 *
 * @returns {import('../../../model/demodata/script/layers.js').Layer[]}
 */
function getLayers() {
  return store.getState().demoData.script.layers.slice();
}
