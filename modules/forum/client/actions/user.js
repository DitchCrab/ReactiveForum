// The owner of the thread
import {
  GET_USER
} from '../constants';

export function getUser(user = null) {
  return {
    type: GET_USER,
    onUser: user
  }
};
