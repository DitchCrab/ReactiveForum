import {
  USER_SESSION,
} from '../constants';

// Sign in session
// Type: object
export default function session(state = null, action) {
  switch (action.type) {
    case USER_SESSION:
      return action.currentUser;
    default:
      return state;
  }
}
