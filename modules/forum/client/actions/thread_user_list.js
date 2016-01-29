// Set list of user whom commended in a thread
import { GET_THREAD_USER_LIST } from '../constants';

/*
* Users who commends in thread
* @params list{arrayOf{object}}
*/
export function getThreadUserList(list) {
  return {
    type: GET_THREAD_USER_LIST,
    list: list
  }
}
