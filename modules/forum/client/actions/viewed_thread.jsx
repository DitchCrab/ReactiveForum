import { ADD_VIEWED_THREAD } from '../constants';

export function addViewedThread(thread) {
  return {
    type: ADD_VIEWED_THREAD,
    viewedThread: thread
  }
}
