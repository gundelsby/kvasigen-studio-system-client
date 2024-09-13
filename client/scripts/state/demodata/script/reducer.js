import layersReducer from './layers/reducer.js';
import partParametersReducer from './part-parameters/reducer.js';
import partsReducer from './parts/reducer.js';

export default function scriptReducer(state = {}, action) {
  return {
    ...state,
    parts: partsReducer(state.parts, action),
    partParameters: partParametersReducer(state.partParameters, action),
    layers: layersReducer(state.layers, action),
  };
}
