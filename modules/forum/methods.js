import ThreadImgs from 'forum/collections/thread_imgs';
import UserAvatars from 'forum/collections/user_avatars';
import Threads from 'forum/collections/threads';
import Categories from 'forum/collections/categories';
import moment from 'moment';
import * as Helper from 'forum/server/helpers';

Meteor.methods({
  updateAvatar: function(imgId) {
    Helper.checkUser();
    let currentUser = Meteor.user();
    let avatar = UserAvatars.find({_id: imgId});
    let observe = avatar.observe({
      changed: function(newImg, oldImg) {
        if (newImg.url()) {
          observe.stop();
          let imgUrl = newImg.url();
          Meteor.users.update({_id: currentUser._id}, {$set: {'profile.avatarId': imgId, 'profile.avatar': imgUrl}});
          Threads.find({'user._id': currentUser._id}).forEach(function(thread) {
            Threads.update({_id: thread._id}, {$set: {'user.avatar': imgUrl}});
          });
          Threads.find({comments: {$elemMatch: {userId: currentUser._id}}}).forEach(function(thread) {
            let update_comments = _.map(thread.comments, function(comment) {
              if (comment.userId === currentUser._id) { comment.avatar = imgUrl};
              return comment;
            });
            Threads.update({_id: thread._id}, {$set: {comments: update_comments}});
          })
        }
      }
    });
    return imgId;
  },
  
  createThread: function(params) {
    Helper.checkUser();
    let current_user = Meteor.user();
    var avatar;
    if (current_user.profile) {
      avatar = current_user.profile.avatar;
    }
    params['user'] = {_id: current_user._id, username: current_user.username, avatar: avatar};
    params['comments'] = [];
    params['createdAt'] = moment.utc().format();
    params['updatedAt'] = moment.utc().format();
    let thread = Threads.insert(params);
    Meteor.users.update({_id: current_user._id}, {$inc: {'threads': 1, 'contribution': 1}});
    if (params.imgId) {
      let img = ThreadImgs.find({_id: params.imgId});
      let observe = img.observe({
        changed: function(newImg, oldImg) {
          if (newImg.url()) {
            observe.stop();
            let imgUrl = newImg.url();
            Threads.update({_id: thread}, {$set: {imgUrl: imgUrl}});
          }
        }
      })
    }
    return thread;
  },
  
  editThread: function(id, params) {
    Helper.checkUser();
    let thread = Threads.update({_id: id}, {$set: params});
    if (params.imgId) {
      let img = ThreadImgs.find({_id: params.imgId});
      let observe = img.observe({
        changed: function(newImg, oldImg) {
          if (newImg.url()) {
            observe.stop();
            let imgUrl = newImg.url();
            Threads.update({_id: id}, {$set: {imgUrl: imgUrl}});
          }
        }
      })
    }
    if (typeof thread === 'number') {
      return id;
    } else {
      return thread;
    }
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

