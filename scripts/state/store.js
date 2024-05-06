import getLogger from '../util/logger.js';
import initialState from './defaultState.js';
import reducer from './reducer.js';

const logger = getLogger('state:store');

const listeners = [];

function createStore(reducer, initialState) {
  let state = initialState;

  return {
    getState: () => state, // should probably be a deep clone, but that's expensive
    subscribe: (listener) => {
      if (listeners.indexOf(listener) < 0) {
        listeners.push(listener);
        return function unsubscribe() {
          const index = listeners.indexOf(listener);
          listeners.splice(index, 1);
        };
      }
    },
    dispatch: (action) => {
      logger.log(`Handling action ${action.type}`);
      state = reducer(state, action);
      logger.success(`State updated`, state);
      listeners.forEach((listener) => listener());
      logger.log(
        `Notified ${listeners.length} listeners that the state has changed`,
      );
    },
  };
}

export const store = createStore(reducer, initialState);
