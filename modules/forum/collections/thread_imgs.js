const ThreadImgs = new FS.Collection("thread-imgs", {
  stores: [new FS.Store.FileSystem("thread-imgs")]
});

export default ThreadImgs;
