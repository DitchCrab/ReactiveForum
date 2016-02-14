export function checkUser() {
  if (!Meteor.user()) {
    throw new Meteor.Error(403, "Access denied");
  }
};

export function checkOwner(id) {
  if (Meteor.user()._id !== id) {
    throw new Meteor.Error(403, "Access denied");
  } 
};
