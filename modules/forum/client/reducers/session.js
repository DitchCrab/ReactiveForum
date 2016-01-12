import {
  USER_SESSION,
} from '../constants';
import { getCurrentUser } from '../actions/session';

export default function session(state = null, action) {
  switch (action.type) {
    case USER_SESSION:
      if (typeof action.currentUser !== 'undefined') {
        return action.currentUser;
      } else {
        return null;
      }
    default:
      return state
  }
}
