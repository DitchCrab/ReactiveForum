import {
  CREATE_THREAD_ERROR,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  CLEAR_THREAD_ERROR,
  SEARCH_ERROR,
  RESET_SEARCH
} from '../constants';

export function authError(state = null, action) {
  switch (action.type) {
    case AUTH_ERROR:
      return action.authErr;
    case CLEAR_AUTH_ERROR:
      return action.authErr;
    default:
      return state
  }
};

export function createThreadError(state = null, action) {
  switch (action.type) {
    case CREATE_THREAD_ERROR:
      return action.createThreadErr;
    case CLEAR_THREAD_ERROR:
      return null;
    default:
      return state;
  }
};

export function searchError(state = null, action) {
  switch (action.type) {
    case SEARCH_ERROR:
    case RESET_SEARCH:
      return action.searchError;
    default:
      return state;
  }
}
