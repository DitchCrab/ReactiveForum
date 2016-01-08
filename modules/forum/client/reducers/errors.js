import {
  CREATE_USER,
  CREATE_SESSION,
  DELETE_SESSION,
  CREATE_NEW_THREAD
} from '../constants';

export function authError(state = null, action) {
  switch (action.type) {
    case CREATE_USER:
    case CREATE_SESSION:
    case DELETE_SESSION:
      return action.authErr;
    default:
      return state
  }
}

export function createThreadError(state = null, action) {
  switch (action.type) {
    case CREATE_NEW_THREAD:
      return action.createThreadErr;
    default:
      return state;
  }
}
