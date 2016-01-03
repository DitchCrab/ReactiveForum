const ThreadImgs = new FS.Collection("thread-imgs", {
  stores: [new FS.Store.FileSystem("thread-imgs")]
});

ThreadImgs.allow({
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

export default ThreadImgs;
