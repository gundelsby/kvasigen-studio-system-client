import partsReducer from './parts/reducer.js';

export default function scriptReducer(state = {}, action) {
  return {
    ...state,
    parts: partsReducer(state.parts, action),
  };
}
