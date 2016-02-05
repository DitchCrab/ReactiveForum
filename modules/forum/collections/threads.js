const Threads = new Mongo.Collection("threads");

Threads.allow({
  insert: function() {
    if (Meteor.user()) {
      return true;      
    } else {
      return false;
    }
  },
  update: function() {
    if (Meteor.user()) {
      return true;      
    } else {
      return false;
    }
  },
  remove: function() {
    return false;
  }
});

let Schemas = {};
Schemas.Thread = new SimpleSchema({
  category: {
    type: String,
    label: "Category id"
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  imgId: {
    type: String,
    optional: true,
  },
  imgUrl: {
    type: String,
    optional: true
  },
  tags: {
    type: Array,
    optional: true
  },
  "tags.$": {
    type: String,
  },
  comments: {
    type: Array,
    optional: true
  },
  "comments.$": {
    type: Object,
    blackbox: true
  },
  likeIds: {
    type: Array,
    optional: true
  },
  "likeIds.$": {
    type: String,
    optional: true
  },
  likes: {
    type: Number,
    optional: true
  },
  user: {
    type: Object,
    blackbox: true
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});

Schemas.Comment = new SimpleSchema({
  _id: {
    type: String
  },
  userId: {
    type: String
  },
  username: {
    type: String
  },
  avatar: {
    type: String,
    optional: true
  },
  text: {
    type: String
  },
  replies: {
    type: Array,
    optional: true
  },
  "replies.$": {
    type: Schemas.Reply,
    optional: true
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  likeIds: {
    type: Array,
    optional: true
  },
  'likeIds.$': {
    type: String,
    optional: true
  },
  likes: {
    type: Number,
    optional: true
  }
});

Schemas.Reply = new SimpleSchema({
  userId: {
    type: String
  },
  username: {
    type: String
  },
  avatar: {
    type: String
  },
  commend: {
    type: String
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    optional: true
  }
})

Threads.attachSchema(Schemas.Thread);
export default Threads;
