// User 'sign in', 'sign out' & 'edit profile'
const CREATE_USER = 'CREATE_USER';
const CREATE_SESSION = 'CREATE_SESSION';
const DELETE_SESSION = 'DELETE_SESSION';
const USER_SESSION = 'USER_SESSION';
const USER_SESSION_CHANGED = 'USER_SESSION_CHANGED';
const UPDATE_USER_AVATAR = 'UPDATE_REPLY';

// Query users with Meteor.users
const GET_FEATURED_USERS = 'GET_FEATURED_USERS';
const FEATURED_USERS_CHANGED = 'FEATURED_USERS_CHANGED';
const REMOVE_FEATURED_USERS = 'REMOVE_FEATURED_USERS';
const GET_USER = 'GET_USER';

// Categories use to filter threads & create new thread
const GET_CATEGORIES = 'GET_CATEGORIES';

// Query threads on specific action
const GET_BROWSING_THREADS = 'GET_BROWSING_THREADS';
const BROWSING_THREADS_UPDATED = 'BROWSING_THREADS_UPDATED';
const REMOVE_BROWSING_THREADS = 'REMOVE_BROWSING_THREADS';
const GET_FEATURED_THREADS = 'GET_FEATURED_USERS';
const GET_USER_THREADS = 'GET_USER_THREADS';

// Update thread
const LIKE_THREAD = 'LIKE_REPLY';
const CREATE_COMMENT = 'CREATE_COMMENT';
const UPDATE_COMMENT = 'UPDATE_COMMENT';
const LIKE_COMMENT = 'LIKE_COMMENT';
const CREATE_REPLY = 'CREATE_REPLY';
const UPDATE_REPLY = 'UPDATE_REPLY';
const LIKE_REPLY = 'LIKE_REPLY';

// Update user profile
const FLAG_THREAD = 'FLAG_THREAD';
const UNFLAG_THREAD = 'UNFLAG_THREAD';

// Create new thread
const CREATE_THREAD;

export default function signUp(username, password) {
  let err = await Accounts.createUser({username: username, password: password, profile: {}});
  if (typeof err === 'undefined') {
    store.dispatch(getCurrentUser());
  }
  return {
    type: CREATE_USER,
    authErr: err
  }
}

export default function signIn(username, password) {
  let err = await Meteor.loginWithPassword(username, password);
  if (typeof err === 'undefined') {
    store.dispatch(getCurrentUser());
  }
  return {
    type: CREATE_SESSION,
    authErr: err
  }
};

export default function signOut(username, password) {
  let err = await Meteor.logout();
  if (typeof err === 'undefined') {
    store.dispatch(getCurrentUser());
  }
  return {
    type: CREATE_SESSION,
    authErr: err
  }
};

export default function getCurrentUser() {
  let user = Meteor.user();
  let cursor = Meteor.users.find({_id: user._id}).observe({
    changed: (oldUsr, newUsr) => {
      if (typeof Meteor.user() === 'undefined') {
        observe.stop();
      }
      store.dispatch(currentUserChanged(newUsr));
    }
  });
  return {
    type: USER_SESSION,
    currentUser: user
  }
};

export default function currentUserChanged(user) {
  return {
    type: USER_SESSION_CHANGED,
    currentUser: user
  }
};

export default function getFeaturedUsers() {
  if (store.getState().usersObserver) {
    store.getState().usersObserver.stop();
  }
  let users = Meteor.users.find({});
  let cursor = users.observe({
    changed: (oldUsers, newUsers) {
      store.dispatch(featuredUsersChanged(newUsers));
    }
  });
  return {
    type: GET_FEATURED_USERS,
    featuredUsers: users,
    usersObserver: cursor
  }
};

export default function featuredUsersChanged(users) {
  return {
    type: FEATURED_USERS_CHANGED,
    featuredUsers: users
  }
};

export default function removeFeaturedUsers() {
  if (store.getState().usersObserver) {
    store.getState().usersObserver.stop();
  }
  return {
    type: REMOVE_FEATURED_USERS,
  }
};

export default function getUser(userId) {
  let user = Meteor.users.findOne({_id: userId});
  return {
    type: GET_USER,
    onUser: user
  }
};

export default function getCategories() {
  let categories = Categories.find().fetch();
  return {
    type: GET_CATEGORIES,
    categories: categories
  }
};

export default function getBrowsingThreads(query, limit) {
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

export default function browsingThreadsUpdated(threads) {
  return {
    type: BROWSING_THREADS_UPDATED,
    browsingThreads: threads
  }
};

export default function removeBrowsingThreads() {
  if (store.getState().browsingObserver) {
    store.getState().browsingObserver.stop();
  }
  return {
    type: REMOVE_BROWSING_THREADS,
  }
};

export default function getFeaturedThreads() {
  let threads = Threads.find({}, {sort: {likes: -1}, limit: 20}).fetch();
  return {
    type: GET_FEATURED_THREADS,
    featuredThreads: threads
  }
};

export default function getUserThreads(userId) {
  let own_threads = Threads.find({'user._id': userId}).fetch();
  let in_threads = Threads.find({comments: {$elemMatch: {userId: userId}}}).fetch();
  return {
    type: GET_USER_THREADS,
    userThreads: _.uniq(_.union(own_threads, in_threads), thread => thread._id)
  }
};

export default function likeThread(id) {
  Meteor.call('likeThread', id);
  return {
    type: LIKE_THREAD
  }
};

export default function createComment(threadId, comment) {
  let {err, res} = async Meteor.cal('createComment', threadId, comment);
  return {
    type: CREATE_COMMENT,
    moveToCommentId: res,
  }
};

export default function updateComment(commentId, text) {
  let { err, res } = async Meteor.call('updateComment', commentId, text);
  return {
    type: UPDATE_COMMENT
  }
};

export default function createReply(threadId, commentId, text) {
  let { err, res } = async Meteor.call('createReply', threadId, commentId, text);
  return {
    type: CREATE_REPLY,
    moveToReplyId: res
  }
};

export default function updateReply(threadId, commentId, replyIndex, text) {
  let { err, res } = async Meteor.call('updateReply', threadId, commentId, replyIndex, text);
  return {
    type: UPDATE_REPLY,
  }
};

export default function likeComment(threadId, commentId) {
  let { err, res } = async Meteor.call('likeComment', threadId, commentId);
  return {
    type: LIKE_COMMENT
  }
};

export default function likeReply(threadId, commentId, replyIndex) {
  let { err, res } = async Meteor.call('likeReply', threadId, commentId, replyIndex);
  return {
    type: LIKE_REPLY
  }
};

export default function flagThread(threadId) {
  let { err, res } = async Meteor.call('flagThread', threadId);
  return {
    type: FLAG_THREAD
  }
};

export default function unflagThread(threadId) {
  let { err, res } = async Meteor.call('unflagThread', threadId);
  return {
    type: UNFLAG_THREAD
  }
};

export default function createThread(params) {
  let { err, res } = async Meteor.call('createThread', params);
  return {
    type: CREATE_THREAD,
    createThreadErr: err
  }
}
