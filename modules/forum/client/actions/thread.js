require('babel-polyfill');

export async function createThread(params) {
  let { err, res } = await Meteor.call('createThread', params);
  return {
    type: CREATE_NEW_THREAD,
    createThreadErr: err
  }
}

export function likeThread(id) {
  Meteor.call('likeThread', id);
  return {
    type: LIKE_THREAD
  }
};

export async function createComment(threadId, comment) {
  let {err, res} = await Meteor.call('createComment', threadId, comment);
  return {
    type: CREATE_COMMENT,
    newCommentId: res,
  }
};

export async function updateComment(commentId, text) {
  let { err, res } = await Meteor.call('updateComment', commentId, text);
  return {
    type: UPDATE_COMMENT
  }
};

export async function createReply(threadId, commentId, text) {
  let { err, res } = await Meteor.call('createReply', threadId, commentId, text);
  return {
    type: CREATE_REPLY,
    newReplyHash: {commentId: commentId, replyIndex: res}
  }
};

export async function updateReply(threadId, commentId, replyIndex, text) {
  let { err, res } = await Meteor.call('updateReply', threadId, commentId, replyIndex, text);
  return {
    type: UPDATE_REPLY,
  }
};

export async function likeComment(threadId, commentId) {
  let { err, res } = await Meteor.call('likeComment', threadId, commentId);
  return {
    type: LIKE_COMMENT
  }
};

export async function likeReply(threadId, commentId, replyIndex) {
  let { err, res } = await Meteor.call('likeReply', threadId, commentId, replyIndex);
  return {
    type: LIKE_REPLY
  }
};

export async function flagThread(threadId) {
  let { err, res } = await Meteor.call('flagThread', threadId);
  return {
    type: FLAG_THREAD
  }
};

export async function unflagThread(threadId) {
  let { err, res } = await Meteor.call('unflagThread', threadId);
  return {
    type: UNFLAG_THREAD
  }
};
