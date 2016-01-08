import {
  GET_USER_THREADS  
} from '../constants';

export default function userThreads(state = GET_USER_THREADS, action) {
  switch (action.type) {
    case GET_USER_THREADS:
      return action.userThreads;
    default:
      return state;
  }
}
