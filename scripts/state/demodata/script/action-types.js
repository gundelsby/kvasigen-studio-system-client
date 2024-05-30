import layerActions from './layers/action-types.js';
import partActions from './parts/action-types.js';

export default {
  layers: { ...layerActions },
  parts: { ...partActions },
};
