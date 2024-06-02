import actionTypes from '../../../state/action-types.js';
import partsApi from './parts.js';
import { store } from '../../../state/store.js';

export default { createLayerWithParts, createLayer };

function createLayerWithParts({ parts = [] }) {
  const layer = createLayerObject();

  for (const part of parts) {
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

function createLayerObject() {
  const uuid = self.crypto.randomUUID();
  const layer = { uuid, parts: [] };

  return layer;
}
