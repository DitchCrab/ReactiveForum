const UserAvatars = new FS.Collection("user-avatars", {
  stores: [new FS.Store.FileSystem("user-avatars")]
});

UserAvatars.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});

export default UserAvatars;
