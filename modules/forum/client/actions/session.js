require('babel-polyfill');

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

