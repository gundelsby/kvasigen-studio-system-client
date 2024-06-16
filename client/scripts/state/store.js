import getLogger from '../util/logger.js';
import initialState from './defaultState.js';
import reducer from './reducer.js';

const logger = getLogger('state:store');

const listeners = [];

function createStore(reducer, initialState) {
  let state = initialState;

  return {
    /**
     * Get the current state from the datastore
     *
     * @returns the current state
     */
    getState: () => state, // should probably be a deep clone, but that's expensive
    /**
     * Register listeners to subscribe to notifications when the state is updated
     *
     * @param {function} listener - listener function that will be called when the state is updated
     * @returns function unsubscribe function that will deregister the listener
     */
    subscribe: (listener) => {
      if (listeners.indexOf(listener) < 0) {
        listeners.push(listener);
        return function unsubscribe() {
          const index = listeners.indexOf(listener);
          listeners.splice(index, 1);
        };
      }
    },
    /**
     * Dispatch an action to the store to update the state.
     *
     * @param {object} action - the action to process
     * @param {string} action.type - the action type
     * @param {object} action.payload - the payload to apply to the state
     */
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
