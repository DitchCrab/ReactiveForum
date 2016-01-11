import { GET_THREAD_USER_LIST } from '../constants';

export function threadUserList(state = null, action) {
  switch (action.type) {
    case GET_THREAD_USER_LIST:
      return action.list;
    default:
      return state;
  }
}
