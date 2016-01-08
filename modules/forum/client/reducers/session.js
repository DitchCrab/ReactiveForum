import {
  USER_SESSION,
  USER_SESSION_CHANGED
} from '../constants';

export default function session(state = USER_SESSION, action) {
  switch (action.type) {
    case USER_SESSION:
    case USER_SESSION_CHANGED:
      return action.currentUser;
    default:
      return state
  }
}
