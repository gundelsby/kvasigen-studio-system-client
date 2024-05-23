import scriptReducer from './script/reducer.js';

export default function (state = {}, action) {
  return { ...state, script: scriptReducer(state.script, action) };
}
