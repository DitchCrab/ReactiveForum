import { ADD_VIEWED_THREAD } from '../constants';

// List of thread viewed
// Type: array of objects
export function viewedThreads(state = [], action) {
  switch (action.type) {
    case ADD_VIEWED_THREAD:
      return state.concat(action.viewedThread);
    default:
      return state;
  }
}
