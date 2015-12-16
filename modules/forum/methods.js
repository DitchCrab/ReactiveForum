import ThreadImgs from 'forum/collections/thread_imgs';
import Threads from 'forum/collections/threads';
import Categories from 'forum/collections/categories';
import moment from 'moment';

Meteor.methods({
  createThread: function(params) {
    checkUser();
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
    return Threads.insert(params);
  },

  likeThread: function(threadId) {
    checkUser();
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    if (_.find(thread.likeIds, (id) => { return id === user._id})) {
      return Threads.update({_id: threadId}, {$pull: {likeIds: user._id}, $inc: {likes: -1}});
    } else {
      return Threads.update({_id: threadId}, {$push: {likeIds: user._id}, $inc: {likes: 1}});
    }
  },

  createComment: function(threadId, params) {
    checkUser();
    return Threads.update({_id: threadId}, {$push: {comments: params}});
  },

  createSubcomment: function(threadId, commendId, params) {
    checkUser();
    params['likeIds'] = [];
    return  Threads.update({_id: threadId, comments: {$elemMatch: {_id: commendId}}}, {$addToSet: {"comments.$.replies": params}});
  },

  likeCommend: function(threadId, commendId) {
    checkUser();
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    if (_.find(_.find(thread.comments, (commend) => { return commend._id === commendId}).likeIds, (id) => {return id === user._id})) {
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commendId}}}, {$inc: {"comments.$.likes": -1}, $pull: {"comments.$.likeIds": user._id}});
    } else {
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commendId}}}, {$inc: {"comments.$.likes": 1}, $push: {"comments.$.likeIds": user._id}});
          
    }
  },

  likeReply: function(threadId, commendId, index) {
    checkUser();
    let paramsId = {};
    let params = {};
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    if (_.find(_.find(thread.comments, (commend) => { return commend._id === commendId}).replies[index].likeIds, (id) => { return id === user._id})) {
      paramsId["comments.$.replies." + index + ".likeIds"] = user._id;
      params["comments.$.replies." + index + ".likes"] = -1;
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commendId}}}, {$inc: params, $pull: paramsId});
    } else {
      paramsId["comments.$.replies." + index + ".likeIds"] = user._id;
      params["comments.$.replies." + index + ".likes"] = 1;
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commendId}}}, {$inc: params, $push: paramsId});
    }
  },

  flagThread: function(threadId) {
    return Meteor.users.update({_id: Meteor.user()._id}, {$addToSet: {"profile.flags": threadId}});
  },
  
  unflagThread: function(threadId) {
    return Meteor.users.update({_id: Meteor.user()._id}, {$pull: {"profile.flags": threadId}});
  },

});

function checkUser() {
  if (!Meteor.user()) {
    throw new Meteor.Error(403, "Access denied")
  }
}
