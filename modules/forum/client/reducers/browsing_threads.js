import {
  SET_BROWSING_QUERY,
  SET_BROWSING_LIMIT,
  BROWSING_THREADS,
  HAS_MORE_BROWSING,
  RESET_SEARCH,
} from '../constants';

export function browsingThreads(state = [], action) {
  switch (action.type) {
    case BROWSING_THREADS:
      return action.browsingThreads;
    default:
      return state;
  }
};

export function browsingLimit(state = 10, action) {
  switch (action.type) {
    case SET_BROWSING_LIMIT:
      return action.browsingLimit;
    case RESET_SEARCH:
      return action.browsingLimit;
    default:
      return state;
  }
};

export function browsingQuery(state = {}, action) {
  switch (action.type) {
    case SET_BROWSING_QUERY:
      return action.browsingQuery;
    case RESET_SEARCH:
      return action.browsingQuery;
    default:
      return state;
  }
};

export function hasMoreBrowsing(state = true, action) {
  switch (action.type) {
    case HAS_MORE_BROWSING:
      return action.hasMoreBrowsing;
    default:
      return state;
  }
}
