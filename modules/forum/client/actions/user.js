// The owner of the thread
import {
  GET_USER
} from '../constants';

/*
* Get user whom are viewed
* @params user{object}
*/
export function getUser(user = null) {
  return {
    type: GET_USER,
    onUser: user
  }
};
