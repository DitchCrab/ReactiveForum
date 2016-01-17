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

export function createThread(params) {
  return dispatch => {
    Meteor.call('createThread', params, (err, res) => {
      if (typeof err === 'undefined') {
        dispatch(clearThreadErr());
        return dispatch(pushPath(`/forum/thread/${res}`));
      };
      return dispatch(createThreadErr(err));
    });
  }
};

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

export function createThreadErr(err) {
  return {
    type: CREATE_THREAD_ERROR,
    createThreadErr: err.reason
  }
};

export function clearThreadErr(err) {
  return {
    type: CLEAR_THREAD_ERROR,
  }
};

export function getThread(thread) {
  return {
    type: GET_THREAD,
    thread: thread,
  }
};

export function likeThread(id) {
  Meteor.call('likeThread', id);
  return {
    type: LIKE_THREAD
  }
};

export function createComment(threadId, comment) {
  return dispatch => {
    Meteor.call('createComment', threadId, comment, (err, res) => {
      if (typeof err === 'undefined') {
        return dispatch(notifyNewComment(res));
      }
    });
  }
};

export function notifyNewComment(commentId) {
  return {
    type: CREATE_COMMENT,
    newCommentId: commentId
  }
};

export function updateComment(threadId, commentId, text) {
  Meteor.call('updateComment', threadId, commentId, text);
  return {
    type: UPDATE_COMMENT
  }
};

export function createReply(threadId, commentId, text) {
  return dispatch => {
    Meteor.call('createReply', threadId, commentId, text, (err, res) => {
      if (typeof err === 'undefined') {
        return dispatch(notifyNewReplyHash(commentId, res));
      }
    });
  }
};

export function notifyNewReplyHash(commentId, replyIndex) {
  return {
    type: CREATE_REPLY,
    newReplyHash: {commentId: commentId, replyIndex: replyIndex}
  }
}

export function updateReply(threadId, commentId, replyIndex, text) {
  Meteor.call('updateReply', threadId, commentId, replyIndex, text);
  return {
    type: UPDATE_REPLY,
  }
};

export function likeComment(threadId, commentId) {
  Meteor.call('likeComment', threadId, commentId);
  return {
    type: LIKE_COMMENT
  }
};

export function likeReply(threadId, commentId, replyIndex) {
  Meteor.call('likeReply', threadId, commentId, replyIndex);
  return {
    type: LIKE_REPLY
  }
};

export function flagThread(threadId) {
  Meteor.call('flagThread', threadId);
  return {
    type: FLAG_THREAD
  }
};

export function unflagThread(threadId) {
  Meteor.call('unflagThread', threadId);
  return {
    type: UNFLAG_THREAD
  }
};

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
