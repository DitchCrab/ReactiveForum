import {
  USER_SESSION,
} from '../constants';

export default function session(state = null, action) {
  switch (action.type) {
    case USER_SESSION:
      return action.currentUser;
    default:
      return state;
  }
}
