import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';
import ThreadImgs from 'forum/collections/thread_imgs';
import UserAvatars from 'forum/collections/user_avatars';

Meteor.publish('categories', function() {
  return Categories.find();
});

Meteor.publish('threadImgs', function() {
  return ThreadImgs.find();
});

Meteor.publish('userAvatars', function() {
  return UserAvatars.find();
});

Meteor.publish('featured-threads', function() {
  return Threads.find({}, {sort: {likes: -1}, limit: 20});
});

Meteor.publish('browsing-threads', function(query, limit) {
  return Threads.find(query, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish('user-threads', function(userId) {
  return Threads.find({"user._id": userId}, {sort: {createdAt: -1}, limit: 10});
});

Meteor.publish('viewing-threads', function(threadId) {
  return Threads.find({_id: threadId});
});
  
Meteor.publish('featured-users', function() {
  return Meteor.users.find({}, {sort: {'profile.contribution': -1}, limit: 20});
})
