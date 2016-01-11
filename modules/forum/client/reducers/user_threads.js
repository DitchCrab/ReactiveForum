import {
  GET_USER_THREADS  
} from '../constants';

export default function userThreads(state = [], action) {
  switch (action.type) {
    case GET_USER_THREADS:
      return action.userThreads;
    default:
      return state;
  }
}
