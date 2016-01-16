import {
  GET_USER  
} from '../constants';

export default function onUser(state = null, action) {
  switch (action.type) {
    case GET_USER:
      if (typeof action.onUser === 'undefined') {
        return null;
      } else {
        return action.onUser;
      }
    default:
      return state;
  }
}
