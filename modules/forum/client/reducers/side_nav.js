import {
  OPEN_SIDE_NAV,
  CLOSE_SIDE_NAV,
  GET_USER_THREADS,
  GET_FEATURED_THREADS,
} from '../constants';

// For small and medium screen
// Show right sideNav of list of users
// Type: boolean
export function sideNavOpened(state = false, action) {
  switch (action.type) {
    case  OPEN_SIDE_NAV:
      return true;
    case CLOSE_SIDE_NAV:
      return false;
    case GET_USER_THREADS:
      return false;
    case GET_FEATURED_THREADS:
      return false;
    default:
      return state;
  }
}
