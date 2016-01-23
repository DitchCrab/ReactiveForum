import {
  GET_USER  
} from '../constants';

// The user that are being view
// Type: object
export default function onUser(state = null, action) {
  switch (action.type) {
    case GET_USER:
      return action.onUser;
    default:
      return state;
  }
}
