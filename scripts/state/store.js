import initialState from './defaultState.js';
import reducer from './reducer.js';

const listeners = [];

function createStore(reducer, initialState) {
  let state = initialState;

  return {
    getState: () => state, // should probably be a deep clone, but that's expensive
    subscribe: (listener) => {
      if (listeners.indexOf(listener) < 0) {
        listeners.push(listener);
      }
    },
    dispatch: (action) => {
      state = reducer(state, action);
    },
  };
}

export const store = createStore(reducer, initialState);
