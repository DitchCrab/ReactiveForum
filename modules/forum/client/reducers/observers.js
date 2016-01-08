import {
  GET_FEATURED_USERS,
  GET_BROWSING_THREADS
} from '../constants';

export function usersObserver(state = null, action) {
  switch (action.type) {
    case GET_FEATURED_USERS:
      return action.usersObserver;
    default:
      return state;
  }
}

export function browsingObserver(state = null, action) {
  switch (action.type) {
    case GET_BROWSING_THREADS:
      return action.browsingObserver;
    default:
      return state;
  }
}
