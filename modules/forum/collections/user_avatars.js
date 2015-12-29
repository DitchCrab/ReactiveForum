const UserAvatars = new FS.Collection("user-avatars", {
  stores: [new FS.Store.FileSystem("user-avatars")]
});

export default UserAvatars;
