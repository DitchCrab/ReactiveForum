//require('babel-polyfill');
import UserAvatars from 'forum/collections/user_avatars';
import {
  USER_SESSION,
  USER_SESSION_CHANGED,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR
} from '../constants';
import store from '../store/create_store';

export function signUp(username, password) {
  return dispatch => {
    Accounts.createUser({username: username, password: password, profile: {}}, function() {
      if (typeof err === 'undefined') {
        return dispatch(getCurrentUser());
      }
      return dispatch(authErr(err));
    });
  }
}

export function signIn(username, password) {
  return dispatch => {
    Meteor.loginWithPassword(username, password, function(err) {
      if (typeof err === 'undefined') {
        return dispatch(getCurrentUser());
      }
      return dispatch(authErr(err));
    });
  }
};

export function signOut(username, password) {
  return dispatch => {
    Meteor.logout(function(err) {
      if (typeof err === 'undefined') {
        return dispatch(getCurrentUser());
      }
      return dispatch(authErr(err));
    });
  }
};

export function authErr(err) {
  return {
    type: AUTH_ERROR,
    authErr: err.reason
  }
};

export function clearAuthErr() {
  return {
    type: CLEAR_AUTH_ERROR,
    authErr: null
  }
};

export function getCurrentUser() {
  let user = Meteor.user();
  if (user) {
    let cursor = Meteor.users.find({_id: user._id}).observe({
      changed: (newUsr, oldUsr) => {
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

export function updateUserAvatar(img) {
  return dispatch => {
    UserAvatars.insert(img, (err, imgObj) => {
      if (imgObj) {
        Meteor.call('updateAvatar', imgObj._id, (err, res) => {
        })
      }
    })
  }
};

export function currentUserChanged(user) {
  return {
    type: USER_SESSION_CHANGED,
    currentUser: user
  }
};

