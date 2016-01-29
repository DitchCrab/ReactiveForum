// Authentication
import UserAvatars from 'forum/collections/user_avatars';
import {
  USER_SESSION,
  USER_SESSION_CHANGED,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR
} from '../constants';

export function signUp(username, password) {
  return dispatch => {
    Accounts.createUser({username: username, password: password, profile: {}}, function(err) {
      if (typeof err === 'undefined') {
        return dispatch(authErr({reason: null}));
      }
      return dispatch(authErr(err));
    });
  }
}

export function signIn(username, password) {
  return dispatch => {
    Meteor.loginWithPassword(username, password, function(err) {
      if (typeof err === 'undefined') {
        return dispatch(authErr({reason: null}));
      }
      return dispatch(authErr(err));
    });
  }
};

export function signOut() {
  return dispatch => {
    Meteor.logout(function(err) {
      if (typeof err === 'undefined') {
        return dispatch(authErr({reason: null}));
      }
      return dispatch(authErr(err));
    });
  }
};

// @params err{string}
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

// @params user(object)
export function getCurrentUser(user = null) {
  return {
    type: USER_SESSION,
    currentUser: user
  }
};

// @params img{imageObj}
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

