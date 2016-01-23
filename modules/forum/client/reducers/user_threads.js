import {
  GET_USER_THREADS  
} from '../constants';

// list of threads which a user created or commended in
// Type: array of objects
export default function userThreads(state = [], action) {
  switch (action.type) {
    case GET_USER_THREADS:
      return action.userThreads;
    default:
      return state;
  }
}
