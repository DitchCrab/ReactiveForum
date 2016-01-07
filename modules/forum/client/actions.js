require('babel-polyfill');

// User 'sign in', 'sign out' & 'edit profile'
export const CREATE_USER = 'CREATE_USER';
export const CREATE_SESSION = 'CREATE_SESSION';
export const DELETE_SESSION = 'DELETE_SESSION';
export const USER_SESSION = 'USER_SESSION';
export const USER_SESSION_CHANGED = 'USER_SESSION_CHANGED';
export const UPDATE_USER_AVATAR = 'UPDATE_REPLY';

// Query users with Meteor.users
export const GET_FEATURED_USERS = 'GET_FEATURED_USERS';
export const FEATURED_USERS_CHANGED = 'FEATURED_USERS_CHANGED';
export const REMOVE_FEATURED_USERS = 'REMOVE_FEATURED_USERS';
export const GET_USER = 'GET_USER';

// Categories use to filter threads & create new thread
export const GET_CATEGORIES = 'GET_CATEGORIES';

// Query threads on specific action
export const GET_BROWSING_THREADS = 'GET_BROWSING_THREADS';
export const BROWSING_THREADS_UPDATED = 'BROWSING_THREADS_UPDATED';
export const REMOVE_BROWSING_THREADS = 'REMOVE_BROWSING_THREADS';
export const GET_FEATURED_THREADS = 'GET_FEATURED_USERS';
export const GET_USER_THREADS = 'GET_USER_THREADS';

// Update thread
export const LIKE_THREAD = 'LIKE_REPLY';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const LIKE_COMMENT = 'LIKE_COMMENT';
export const CREATE_REPLY = 'CREATE_REPLY';
export const UPDATE_REPLY = 'UPDATE_REPLY';
export const LIKE_REPLY = 'LIKE_REPLY';

// Update user profile
export const FLAG_THREAD = 'FLAG_THREAD';
export const UNFLAG_THREAD = 'UNFLAG_THREAD';

// Create new thread
export const CREATE_NEW_THREAD = 'CREATE_NEW_THREAD';

export async function signUp(username, password) {
  let err = await Accounts.createUser({username: username, password: password, profile: {}});
  if (typeof err === 'undefined') {
    store.dispatch(getCurrentUser());
  }
  return {
    type: CREATE_USER,
    authErr: err
  }
}

export async function signIn(username, password) {
  let err = await Meteor.loginWithPassword(username, password);
  if (typeof err === 'undefined') {
    store.dispatch(getCurrentUser());
  }
  return {
    type: CREATE_SESSION,
    authErr: err
  }
};

export async function signOut(username, password) {
  let err = await Meteor.logout();
  if (typeof err === 'undefined') {
    store.dispatch(getCurrentUser());
  }
  return {
    type: DELETE_SESSION,
    authErr: err
  }
};

export function getCurrentUser() {
  let user = Meteor.user();
  if (user) {
    let cursor = Meteor.users.find({_id: user._id}).observe({
      changed: (oldUsr, newUsr) => {
        if (typeof Meteor.user() === 'undefined') {
          observe.stop();
        }
        store.dispatch(currentUserChanged(newUsr));
      }
    });
  }
  return {
    type: USER_SESSION,
    currentUser: user
  }
};

export function currentUserChanged(user) {
  return {
    type: USER_SESSION_CHANGED,
    currentUser: user
  }
};

export function getFeaturedUsers() {
  if (store.getState().usersObserver) {
    store.getState().usersObserver.stop();
  }
  let users = Meteor.users.find({});
  let cursor = users.observe({
    changed: (oldUsers, newUsers) => {
      store.dispatch(featuredUsersChanged(newUsers));
    }
  });
  return {
    type: GET_FEATURED_USERS,
    featuredUsers: users,
    usersObserver: cursor
  }
};

export function featuredUsersChanged(users) {
  return {
    type: FEATURED_USERS_CHANGED,
    featuredUsers: users
  }
};

export function removeFeaturedUsers() {
  if (store.getState().usersObserver) {
    store.getState().usersObserver.stop();
  }
  return {
    type: REMOVE_FEATURED_USERS,
  }
};

export function getUser(userId) {
  let user = Meteor.users.findOne({_id: userId});
  return {
    type: GET_USER,
    onUser: user
  }
};

export function getCategories() {
  let categories = Categories.find().fetch();
  return {
    type: GET_CATEGORIES,
    categories: categories
  }
};

export function getBrowsingThreads(query, limit) {
  if (store.getState().browsingObserver) {
    store.getState().browsingObserver.stop();
  }
  let threads = Threads.find(query, {sort: {createdAt: -1}, limit: limit});
  let cursor = threads.observe({
    changed: (oldThreads, newThreads) => {
      store.dispatch(browsingThreadsUpdated(newThreads));
    }
  });
  return {
    type: GET_BROWSING_THREADS,
    browsingThreads: threads.fetch(),
    browsingObserver: cursor,
  }
};

export function browsingThreadsUpdated(threads) {
  return {
    type: BROWSING_THREADS_UPDATED,
    browsingThreads: threads
  }
};

export function removeBrowsingThreads() {
  if (store.getState().browsingObserver) {
    store.getState().browsingObserver.stop();
  }
  return {
    type: REMOVE_BROWSING_THREADS,
  }
};

export function getFeaturedThreads() {
  let threads = Threads.find({}, {sort: {likes: -1}, limit: 20}).fetch();
  return {
    type: GET_FEATURED_THREADS,
    featuredThreads: threads
  }
};

export function getUserThreads(userId) {
  let own_threads = Threads.find({'user._id': userId}).fetch();
  let in_threads = Threads.find({comments: {$elemMatch: {userId: userId}}}).fetch();
  return {
    type: GET_USER_THREADS,
    userThreads: _.uniq(_.union(own_threads, in_threads), thread => thread._id)
  }
};

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

export async function createThread(params) {
  let { err, res } = await Meteor.call('createThread', params);
  return {
    type: CREATE_NEW_THREAD,
    createThreadErr: err
  }
}
