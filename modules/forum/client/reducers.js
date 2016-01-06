import * from './actions';
import { combineReducers } from 'redux';

function session(state = USER_SESSION, action) {
  switch (action.type) {
    case USER_SESSION:
    case USER_SESSION_CHANGED:
      return action.currentUser;
    default:
      return state
  }
}

function authError(state, action) {
  switch (action.type) {
    case CREATE_USER:
    case CREATE_SESSION:
    case DELETE_SESSION:
      return action.authErr;
    default:
      return state
  }
}

function featuredUsers(state = GET_FEATURED_USERS, action) {
  switch (action.type) {
    case GET_FEATURED_USERS:
    case FEATURED_USERS_CHANGED:
      return action.featuredUsers;
    case REMOVE_FEATURED_USERS:
      return null;
    default:
      return state;
  }
}

function onUser(state = GET_USER, action) {
  switch (action.type) {
    case GET_USER:
      return action.onUser;
    default:
      return state;
  }
}

function categories(state = GET_CATEGORIES, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
}

function browsingThreads(state = GET_BROWSING_THREADS, action) {
  switch (action.type) {
    case GET_BROWSING_THREADS:
    case BROWSING_THREADS_UPDATED:
      return action.browsingThreads;
    case REMOVE_BROWSING_THREADS:
      return null;
    default:
      return state;
  }
}

function featuredThreads(state = GET_FEATURED_THREADS, action) {
  switch (action.type) {
    case GET_FEATURED_THREADS:
      return action.featuredThreads;
    default:
      return state;
  }
}

function userThreads(state = GET_USER_THREADS, action) {
  switch (action.type) {
    case GET_USER_THREADS:
      return action.userThreads;
    default:
      return state;
  }
}

function usersObserver(state, action) {
  switch (action.type) {
    case GET_FEATURED_USERS:
      return action.usersObserver;
    default:
      return state;
  }
}

function browsingObserver(state, action) {
  switch (action.type) {
    case GET_BROWSING_THREADS:
      return action.browsingObserver;
    default:
      return state;
  }
}

function newCommentId(state, action) {
  switch (action.type) {
    case CREATE_COMMENT:
      return action.newCommentId;
    default:
      return state;
  }
}

function newReplyHash(state = {}, action) {
  switch (action.type) {
    case CREATE_REPLY:
      return action.newReplyHash;
    default:
      return state;
  }
}

function createThreadError(state, action) {
  switch (action.type) {
    case CREATE_THREAD:
      return action.createThreadErr;
    default:
      return state;
  }
}

const forum = combineReducers({
  session,
  authError,
  featuredUsers,
  onUser,
  categories,
  browsingThreads,
  featuredThreads,
  userThreads,
  usersObserver,
  browsingObserver,
  newCommentId,
  newReplyHash,
  createThreadError
});

export default forum;
