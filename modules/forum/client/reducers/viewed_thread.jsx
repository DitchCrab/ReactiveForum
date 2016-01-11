import { ADD_VIEWED_THREAD } from '../constants';

export function viewedThreads(state = [], action) {
  switch (action.type) {
    case ADD_VIEWED_THREAD:
      return state.concat(action.viewedThread);
    default:
      return state;
  }
}
