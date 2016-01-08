import {
  CREATE_COMMENT,
  CREATE_REPLY
} from '../constants';

export function newCommentId(state = null, action) {
  switch (action.type) {
    case CREATE_COMMENT:
      return action.newCommentId;
    default:
      return state;
  }
}

export function newReplyHash(state = {}, action) {
  switch (action.type) {
    case CREATE_REPLY:
      return action.newReplyHash;
    default:
      return state;
  }
}
