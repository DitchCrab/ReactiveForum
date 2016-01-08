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
