import ThreadImgs from 'forum/collections/thread_imgs';
import Threads from 'forum/collections/threads';

Meteor.methods({
  createGroup: function(params) {
    checkUser();
    params['imgUrl'] = ThreadImgs.findOne({_id: params.imgId}).url();
    return Theads.insert(params);
  },

  likeGroup: function(groupId) {
    checkUser();
    let user = Meteor.user();
    let group = Theads.findOne({_id: groupId});
    if (_.find(group.likeIds, (id) => { return id === user._id})) {
      return Theads.update({_id: groupId}, {$pull: {likeIds: user._id}, $inc: {likes: -1}});
    } else {
      return Theads.update({_id: groupId}, {$push: {likeIds: user._id}, $inc: {likes: 1}});
    }
  },

  createComment: function(groupId, params) {
    checkUser();
    return Theads.update({_id: groupId}, {$push: params});
  },

  createSubcomment: function(groupId, commendId, params) {
    checkUser();
    params['likeIds'] = [];
    return  Theads.update({_id: groupId, comments: {$elemMatch: {_id: commendId}}}, {$addToSet: {"comments.$.replies": params}});
  },

  likeCommend: function(groupId, commendId) {
    checkUser();
    let user = Meteor.user();
    let group = Theads.findOne({_id: groupId});
    if (_.find(_.find(group.comments, (commend) => { return commend._id === commendId}).likeIds, (id) => {return id === user._id})) {
      return Theads.update({_id: groupId, comments: {$elemMatch: {_id: commendId}}}, {$inc: {"comments.$.likes": -1}, $pull: {"comments.$.likeIds": user._id}});
    } else {
      return Theads.update({_id: groupId, comments: {$elemMatch: {_id: commendId}}}, {$inc: {"comments.$.likes": 1}, $push: {"comments.$.likeIds": user._id}});
          
    }
  },

  likeSubCommend: function(groupId, commendId, index) {
    checkUser();
    let paramsId = {};
    let params = {};
    let user = Meteor.user();
    let group = Theads.findOne({_id: groupId});
    if (_.find(_.find(group.comments, (commend) => { return commend._id === commendId}).replies[index].likeIds, (id) => { return id === user._id})) {
      paramsId["comments.$.replies." + index + ".likeIds"] = user._id;
      params["comments.$.replies." + index + ".likes"] = -1;
      return Theads.update({_id: groupId, comments: {$elemMatch: {_id: commendId}}}, {$inc: params, $pull: paramsId});
    } else {
      paramsId["comments.$.replies." + index + ".likeIds"] = user._id;
      params["comments.$.replies." + index + ".likes"] = 1;
      return Theads.update({_id: groupId, comments: {$elemMatch: {_id: commendId}}}, {$inc: params, $push: paramsId});
    }
      
  }
});

function checkUser() {
  if (!Meteor.user()) {
    throw new Meteor.Error(403, "Access denied")
  }
}
