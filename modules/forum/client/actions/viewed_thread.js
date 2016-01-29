// Threads which are viewed.
// Use for acrousel
import { ADD_VIEWED_THREAD } from '../constants';

/*
* Add thread to viewedThread
* @params thread{object}
*/
export function addViewedThread(thread) {
  return {
    type: ADD_VIEWED_THREAD,
    viewedThread: thread
  }
}
