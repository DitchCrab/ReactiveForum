import { GET_THREAD_USER_LIST } from '../constants';

// List of users whom commended in thread
// Type: array of string
export function threadUserList(state = [], action) {
  switch (action.type) {
    case GET_THREAD_USER_LIST:
      return action.list;
    default:
      return state;
  }
}
