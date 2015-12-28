import ThreadImgs from 'forum/collections/thread_imgs';
import Threads from 'forum/collections/threads';
import Categories from 'forum/collections/categories';
import moment from 'moment';
import * as Helper from 'forum/server/helpers';

Meteor.methods({
  createThread: function(params) {
    Helper.checkUser();
    if(params.imgId) {
      let img = ThreadImgs.findOne({_id: params.imgId});
      params['imgUrl'] = img.url();
    };
    let current_user = Meteor.user();
    var avatar;
    if (current_user.profile) {
      avatar = current_user.profile.avatar;
    }
    params['user'] = {_id: current_user._id, username: current_user.username, avatar: avatar};
    params['comments'] = [];
    params['createdAt'] = moment.utc().format();
    params['updatedAt'] = moment.utc().format();
    Meteor.users.update({_id: current_user._id}, {$inc: {'threads': 1, 'contribution': 1}});
    return Threads.insert(params);
  },

  likeThread: function(threadId) {
    Helper.checkUser();
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    if (_.find(thread.likeIds, (id) => { return id === user._id})) {
      return Threads.update({_id: threadId}, {$pull: {likeIds: user._id}, $inc: {likes: -1}});
    } else {
      return Threads.update({_id: threadId}, {$push: {likeIds: user._id}, $inc: {likes: 1}});
    }
  },

  createComment: function(threadId, comment) {
    Helper.checkUser();
    let user = Meteor.user();
    var avatar;
    if (user.profile) {
      avatar = user.profile.avatar;
    };
    let params = {_id: Random.id(), userId: user._id, username: user.username, avatar: avatar, text: comment, createdAt: moment.utc().format(), likes: 0, likeIds: [], replies: []};
    Meteor.users.update({_id: user._id}, {$inc: {'comments': 1, 'contribution': 1}});
    if (Threads.update({_id: threadId}, {$push: {comments: params}}) ) {
      return params._id; 
    } else {
      throw new Meteor.Error(500, "Fail to commend");
    }
  },

  updateComment: function(threadId, commentId, text) {
    Helper.checkUser();
    return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$set: {"comments.$.text": text}});
  },

  createReply: function(threadId, commentId, reply) {
    Helper.checkUser();
    let user = Meteor.user();
    var avatar;
    if (user.profile) {
      avatar = user.profile.avatar;
    };
    let params = {_id: Random.id(12), userId: user._id, username: user.username, avatar: avatar, text: reply, createdAt: moment.utc().format(), like: 0, likeIds: []};
    Meteor.users.update({_id: user._id}, {$inc: {'replies': 1, 'contribution': 1}});
    if (Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$addToSet: {"comments.$.replies": params}}) ) {
      return params._id;
    } else {
      throw new Meteor.Error(500, "Fail to reply");
    }
  },

  updateReply: function(threadId, commentId, replyIndex, text) {
    Helper.checkUser();
    let params = {};
    params["comments.$.replies." + replyIndex + ".text"] = text;
    return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$set: params});
  },

  likeComment: function(threadId, commentId) {
    Helper.checkUser();
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    if (_.find(_.find(thread.comments, (comment) => { return comment._id === commentId}).likeIds, (id) => {return id === user._id})) {
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$inc: {"comments.$.likes": -1}, $pull: {"comments.$.likeIds": user._id}});
    } else {
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$inc: {"comments.$.likes": 1}, $push: {"comments.$.likeIds": user._id}});
          
    }
  },

  likeReply: function(threadId, commentId, index) {
    Helper.checkUser();
    let paramsId = {};
    let params = {};
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    if (_.find(_.find(thread.comments, (comment) => { return comment._id === commentId}).replies[index].likeIds, (id) => { return id === user._id})) {
      paramsId["comments.$.replies." + index + ".likeIds"] = user._id;
      params["comments.$.replies." + index + ".likes"] = -1;
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$inc: params, $pull: paramsId});
    } else {
      paramsId["comments.$.replies." + index + ".likeIds"] = user._id;
      params["comments.$.replies." + index + ".likes"] = 1;
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$inc: params, $push: paramsId});
    }
  },

  flagThread: function(threadId) {
    return Meteor.users.update({_id: Meteor.user()._id}, {$addToSet: {"profile.flags": threadId}});
  },
  
  unflagThread: function(threadId) {
    return Meteor.users.update({_id: Meteor.user()._id}, {$pull: {"profile.flags": threadId}});
  },

});

