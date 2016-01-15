import {
  GET_THREAD,
  CREATE_REPLY,
  CLOSE_REPLY,
  OPEN_REPLY
} from '../constants';

export function thread(state = null, action) {
  switch (action.type) {
    case GET_THREAD:
      return action.thread;
    default:
      return state;
  }
};

export function onReplying(state = null, action) {
  switch (action.type) {
    case OPEN_REPLY:
      return action.commentId;
    case CLOSE_REPLY:
      return null;
    case CREATE_REPLY:
      return null;
    default:
      return state;
  }
}
