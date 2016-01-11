import {
  USER_SESSION,
  USER_SESSION_CHANGED
} from '../constants';
import { getCurrentUser } from '../actions/session';

const initialState = getCurrentUser().currentUser;

export default function session(state = initialState, action) {
  switch (action.type) {
    case USER_SESSION:
    case USER_SESSION_CHANGED:
      return action.currentUser;
    default:
      return state
  }
}
