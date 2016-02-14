import ThreadImgs from 'forum/collections/thread_imgs';
import UserAvatars from 'forum/collections/user_avatars';
import Threads from 'forum/collections/threads';
import Categories from 'forum/collections/categories';
import moment from 'moment';
import * as Helper from 'forum/helpers';

Meteor.methods({
  /**
  * Update user avatar method
  * Also update user avatar on thread and comments, but not replies
  * @params imgId {string} - UserAvatars Id
  */
  updateAvatar: function(imgId) {
    Helper.checkUser();
    let currentUser = Meteor.user();
    // Observe is avatar is successfully uploaded
    let avatar = UserAvatars.find({_id: imgId});
    let observe = avatar.observe({
      changed: function(newImg, oldImg) {
        if (newImg.url()) {
          observe.stop();
          let imgUrl = newImg.url();
          // Update user avatar url
          Meteor.users.update({_id: currentUser._id}, {$set: {'profile.avatarId': imgId, 'profile.avatar': imgUrl}});
          // Update user avatar in thread
          Threads.find({'user._id': currentUser._id}).forEach(function(thread) {
            Threads.update({_id: thread._id}, {$set: {'user.avatar': imgUrl}});
          });
          // Update user avatar in comments
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
    // If success, return imgId
    return imgId;
  },

  /**
   * Create new thread method
   * @params params.category{string} - category id
   * @params params.title{string}
   * @params params.description{string}
   * @params params.tags{array}
   * @params params.imgId{string} - ThreadImgs id
   */
  createThread: function(params) {
    Helper.checkUser();
    let current_user = Meteor.user();
    var avatar;
    if (current_user.profile) {
      avatar = current_user.profile.avatar;
    }
    params['user'] = {_id: current_user._id, username: current_user.username, avatar: avatar};
    if (params.tags) {
      params.tags = _.map(params.tags.split(','), x => x.trim());
    }
    params['comments'] = [];
    params['createdAt'] = moment.utc().format();
    params['updatedAt'] = moment.utc().format();
    let thread = Threads.insert(params);
    // Update user profile. Usefull to sort user based on contributions
    Meteor.users.update({_id: current_user._id}, {$inc: {'threads': 1, 'contribution': 1}});
    if (params.imgId) {
      let img = ThreadImgs.find({_id: params.imgId});
      // Watch if image is uploaded and update thread with image url
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
    // If success, return threadId
    return thread;
  },

  /**
   * Edit new thread method
   * @params params.category{string} - category id
   * @params params.title{string}
   * @params params.description{string}
   * @params params.tags{array}
   * @params params.imgId{string} - ThreadImgs id
   */
  editThread: function(id, params) {
    Helper.checkUser();
    // Check if editor is owner. Return 'Access denied'
    Helper.checkOwner(Threads.findOne({_id: id}).user._id);
    if (params.tags) {
      params.tags = _.map(params.tags.split(','), x => x.trim());
    }
    let thread = Threads.update({_id: id}, {$set: params});
    if (params.imgId) {
      // Watch if thread edited with image. Update thread image url
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
    // Update success return number of document changed
    // We want to return threadId
    if (typeof thread === 'number') {
      return id;
    } else {
      return thread;
    }
  },

  /**
  * Like thread method
  * Add user to likeIds array in thread and increase likes if not likes
  * Remove user from likeIds array and reduce likes if likes
  * @params threadId{string} - thread id
  */
  likeThread: function(threadId) {
    Helper.checkUser();
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    // If user already like thread. Remove user from array and reduce like
    // Else add user to like array and increase like
    if (_.find(thread.likeIds, (id) => { return id === user._id})) {
      return Threads.update({_id: threadId}, {$pull: {likeIds: user._id}, $inc: {likes: -1}});
    } else {
      return Threads.update({_id: threadId}, {$push: {likeIds: user._id}, $inc: {likes: 1}});
    }
  },

  /**
   * Create comment methods
   * Add comment to comments array
   * Add contribution point to user profile
   * @params threadId{string} - thread id
   * @params comment{string}
   */
  createComment: function(threadId, comment) {
    Helper.checkUser();
    let user = Meteor.user();
    var avatar;
    if (user.profile) {
      avatar = user.profile.avatar;
    };
    let params = {_id: Random.id(), userId: user._id, username: user.username, avatar: avatar, text: comment, createdAt: moment.utc().format(), likes: 0, likeIds: [], replies: []};
    if (Threads.update({_id: threadId}, {$push: {comments: params}}) ) {
      // If comment is created, add contribution point to user
      Meteor.users.update({_id: user._id}, {$inc: {'comments': 1, 'contribution': 1}});
      return params._id; 
    } else {
      throw new Meteor.Error(500, "Fail to commend");
    }
  },

  /**
   * Update comment method
   * Update comment to comments array
   * @params threadId{string} - thread id
   * @params commentId{string} - comment id
   * @params text{string}
   */
  updateComment: function(threadId, commentId, text) {
    Helper.checkUser();
    Helper.checkOwner(_.find(Threads.findOne({_id: threadId}).comments, comment => comment._id === commentId).userId);
    return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$set: {"comments.$.text": text}});
  },

  /**
   * Create reply method
   * Add reply to replies array in comment
   * Add contribution point to user profile
   * @params threadId{string} - thread id
   * @params commentId{string}
   * @params reply{string}
   */
  createReply: function(threadId, commentId, reply) {
    Helper.checkUser();
    let user = Meteor.user();
    var avatar;
    if (user.profile) {
      avatar = user.profile.avatar;
    };
    let params = {_id: Random.id(12), userId: user._id, username: user.username, avatar: avatar, text: reply, createdAt: moment.utc().format(), like: 0, likeIds: []};
    if (Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$addToSet: {"comments.$.replies": params}}) ) {
      // If reply is created, add contribution point to user
      Meteor.users.update({_id: user._id}, {$inc: {'replies': 1, 'contribution': 1}});
      return params._id;
    } else {
      throw new Meteor.Error(500, "Fail to reply");
    }
  },

  /**
   * Update reply method
   * Update reply in replies array in comment
   * @params threadId{string} - thread id
   * @params commentId{string}
   * @params replyIndex{number}
   * @params text{string}
   */
  updateReply: function(threadId, commentId, replyIndex, text) {
    Helper.checkUser();
    Helper.checkOwner(_.find(Threads.findOne({_id: threadId}).comments, comment => comment._id === commentId).replies[replyIndex].userId);
    let params = {};
    params["comments.$.replies." + replyIndex + ".text"] = text;
    return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$set: params});
  },

  /**
   * Like comment method
   * Increase likes and add userId to likeIds if not liked
   * Reduce likes and remove userId  from likeIds if liked
   * @params threadId{string} - thread id
   * @params commentId{string} - comment id
   */
  likeComment: function(threadId, commentId) {
    Helper.checkUser();
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    // If is already liked, remove user from array and decrease like
    // Else add user to array and increase like
    if (_.find(_.find(thread.comments, (comment) => { return comment._id === commentId}).likeIds, (id) => {return id === user._id})) {
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$inc: {"comments.$.likes": -1}, $pull: {"comments.$.likeIds": user._id}});
    } else {
      return Threads.update({_id: threadId, comments: {$elemMatch: {_id: commentId}}}, {$inc: {"comments.$.likes": 1}, $push: {"comments.$.likeIds": user._id}});
      
    }
  },

  /**
   * Like reply method
   * Increase likes and add userId to likeIds if not liked
   * Reduce likes and remove userId  from likeIds if liked
   * @params threadId{string} - thread id
   * @params commentId{string} - comment id
   * @params index{number} -reply index
   */
  likeReply: function(threadId, commentId, index) {
    Helper.checkUser();
    let paramsId = {};
    let params = {};
    let user = Meteor.user();
    let thread = Threads.findOne({_id: threadId});
    // If alrealy liked, remove user from array and decrease like
    // Else add user to array and increase like
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

  /**
   * Flag thread method
   * Add thread id to user profile flags array
   * @params threadId{string}
   */
  flagThread: function(threadId) {
    return Meteor.users.update({_id: Meteor.user()._id}, {$addToSet: {"profile.flags": threadId}});
  },
  
  /**
   * Unflag thread method
   * Remove thread id from user profile flags array
   * @params threadId{string}
   */
  unflagThread: function(threadId) {
    return Meteor.users.update({_id: Meteor.user()._id}, {$pull: {"profile.flags": threadId}});
  },

});

