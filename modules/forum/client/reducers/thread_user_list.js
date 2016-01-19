import { GET_THREAD_USER_LIST } from '../constants';

export function threadUserList(state = [], action) {
  switch (action.type) {
    case GET_THREAD_USER_LIST:
      return action.list;
    default:
      return state;
  }
}
