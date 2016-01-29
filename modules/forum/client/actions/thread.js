//require('babel-polyfill');
import Threads from 'forum/collections/threads';
import { pushPath } from 'redux-simple-router';
import {
  CREATE_THREAD_ERROR,
  CLEAR_THREAD_ERROR,
  LIKE_THREAD,
  GET_THREAD,
  THREAD_CHANGED,
  STOP_THREAD_OBSERVER,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  CREATE_REPLY,
  UPDATE_REPLY,
  LIKE_COMMENT,
  LIKE_REPLY,
  FLAG_THREAD,
  UNFLAG_THREAD,
  OPEN_REPLY,
  CLOSE_REPLY
} from '../constants';

/*
 * Create new thread
 * @params params.category{id}
 * @params params.title{string}
 * @params params.description(string)
 * @params params.tags{array}
 * @params params.imgId{string}
 */
export function createThread(params) {
  return dispatch => {
    Meteor.call('createThread', params, (err, res) => {
      if ((typeof err === 'undefined') && res) {
        dispatch(clearThreadErr());
        return dispatch(pushPath(`/forum/thread/${res}`));
      };
      return dispatch(createThreadErr(err));
    });
  }
};

/*
 * Edit thread
* @params id{string} - threadId
 * @params params.category{id}
 * @params params.title{string}
 * @params params.description(string)
 * @params params.tags{array}
 * @params params.imgId{string}
 */
export function editThread(id, params) {
  return dispatch => {
    Meteor.call('editThread', id, params, (err, res) => {
      if (typeof err === 'undefined') {
        dispatch(clearThreadErr());
        return dispatch(pushPath(`/forum/thread/${res}`));
      };
      return dispatch(createThreadErr(err));
    });
  }
};

// @params err{string}
export function createThreadErr(err) {
  return {
    type: CREATE_THREAD_ERROR,
    createThreadErr: err.reason
  }
};

export function clearThreadErr() {
  return {
    type: CLEAR_THREAD_ERROR,
  }
};

/*
* Thread
* @params thread{object}
*/
export function getThread(thread = null) {
  return {
    type: GET_THREAD,
    thread: thread,
  }
};

/*
* Like thread
* @params id{string} - threadId
*/
export function likeThread(id) {
  Meteor.call('likeThread', id);
  return {
    type: LIKE_THREAD
  }
};

/*
* Create comment in thread
* @params threadId{string}
* @params comment{string}
*/
export function createComment(threadId, comment) {
  return dispatch => {
    Meteor.call('createComment', threadId, comment, (err, res) => {
      if (typeof err === 'undefined') {
        return dispatch(notifyNewComment(res));
      }
    });
  }
};

/*
* Notify if new comment is created
* @params commentId{string}
*/
export function notifyNewComment(commentId) {
  return {
    type: CREATE_COMMENT,
    newCommentId: commentId
  }
};

/*
 * Update comment
 * @params threadId{string} 
 * @params commentId{string}
 * @params text{string}
 */
export function updateComment(threadId, commentId, text) {
  Meteor.call('updateComment', threadId, commentId, text);
  return {
    type: UPDATE_COMMENT
  }
};

/*
 * Create reply
 * @params threadId{string} 
 * @params commentId{string}
 * @params text{string}
 */
export function createReply(threadId, commentId, text) {
  return dispatch => {
    Meteor.call('createReply', threadId, commentId, text, (err, res) => {
      if (typeof err === 'undefined') {
        return dispatch(notifyNewReplyHash(commentId, res));
      }
    });
  }
};

/*
* Notify when new reply is created by user
* @params commentId{string}
* @params replyIndex{number}
*/
export function notifyNewReplyHash(commentId, replyIndex) {
  return {
    type: CREATE_REPLY,
    newReplyHash: {commentId: commentId, replyIndex: replyIndex}
  }
}

/*
* Update reply
* @params threadId{string}
* @params commentId{string}
* @params replyIndex{number}
* @params text{string}
*/
export function updateReply(threadId, commentId, replyIndex, text) {
  Meteor.call('updateReply', threadId, commentId, replyIndex, text);
  return {
    type: UPDATE_REPLY,
  }
};

/*
* Like comment
* @params threadId{string}
* @params commentId{string}
*/
export function likeComment(threadId, commentId) {
  Meteor.call('likeComment', threadId, commentId);
  return {
    type: LIKE_COMMENT
  }
};

/*
* Like reply
* @params threadId{string}
* @params commentId{string}
* @params replyIndex{number}
*/
export function likeReply(threadId, commentId, replyIndex) {
  Meteor.call('likeReply', threadId, commentId, replyIndex);
  return {
    type: LIKE_REPLY
  }
};

/*
* Flag thread
* @params threadId{string}
*/
export function flagThread(threadId) {
  Meteor.call('flagThread', threadId);
  return {
    type: FLAG_THREAD
  }
};

/*
* Unflag thread
* @params threadId{string}
*/
export function unflagThread(threadId) {
  Meteor.call('unflagThread', threadId);
  return {
    type: UNFLAG_THREAD
  }
};

/*
 * Open Reply field
 * @params id{string} - CommentId
 */
export function openReply(id) {
  return {
    type: OPEN_REPLY,
    commentId: id
  }
};

export function closeReply() {
  return {
    type: CLOSE_REPLY
  }
}
