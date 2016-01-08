import {
  GET_USER  
} from '../constants';

export default function onUser(state = GET_USER, action) {
  switch (action.type) {
    case GET_USER:
      return action.onUser;
    default:
      return state;
  }
}
