import {
  CREATE_COMMENT,
  CREATE_REPLY
} from '../constants';

// When comment is created by user
// Use to scroll to view
// type: string
export function newCommentId(state = null, action) {
  switch (action.type) {
    case CREATE_COMMENT:
      return action.newCommentId;
    default:
      return state;
  }
}

// When reply is created by user
// Use to scroll to view
// type: object(commentId, replyIndex)
export function newReplyHash(state = {}, action) {
  switch (action.type) {
    case CREATE_REPLY:
      return action.newReplyHash;
    default:
      return state;
  }
}
