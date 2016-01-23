import {
  OPEN_BROWSING,
  CLOSE_BROWSING,
  SET_BROWSING_QUERY,
  SET_BROWSING_LIMIT,
  BROWSING_THREADS,
  HAS_MORE_BROWSING,
  RESET_SEARCH,
} from '../constants';
import { UPDATE_PATH } from 'redux-simple-router';

// For small screen, if user view left browsing of not
// Type: boolean
export function browsingOpened(state = false, action) {
  switch (action.type) {
    case OPEN_BROWSING:
      return true;
    case CLOSE_BROWSING:
      return false;
    case UPDATE_PATH:
      return false;
    default:
      return state;
  }
};

// List of threads on left side
// Type: array
export function browsingThreads(state = [], action) {
  switch (action.type) {
    case BROWSING_THREADS:
      return action.browsingThreads;
    default:
      return state;
  }
};

// Number of threads are fetch.
// Type: integer
export function browsingLimit(state = 10, action) {
  switch (action.type) {
    case SET_BROWSING_LIMIT:
      return action.browsingLimit;
    case RESET_SEARCH:
      return 10;
    default:
      return state;
  }
};

// Query used to fetch threads
// Type: object
export function browsingQuery(state = {}, action) {
  switch (action.type) {
    case SET_BROWSING_QUERY:
      return action.browsingQuery;
    case RESET_SEARCH:
      return {};
    default:
      return state;
  }
};

// If there are more threads to fetch
// Type: boolean
export function hasMoreBrowsing(state = true, action) {
  switch (action.type) {
    case HAS_MORE_BROWSING:
      return action.hasMoreBrowsing;
    default:
      return state;
  }
}
