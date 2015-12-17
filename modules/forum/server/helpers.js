export function checkUser() {
  if (!Meteor.user()) {
    throw new Meteor.Error(403, "Access denied")
  }
}

