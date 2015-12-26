import Threads from 'forum/collections/threads';
import ThreadImgs from 'forum/collections/thread_imgs';

Meteor.publish('featured-threads', function() {
  return Threads.find({}, {sort: {likes: -1}, limit: 10});
});

Meteor.publish('browsing-threads', function(query, limit) {
  return Threads.find(query, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish('user-threads', function(userId) {
  return Threads.find({"user._id": userId}, {sort: {createdAt: -1}, limit: 10});
});

Meteor.publish('viewing-threads', function(threadId) {
  return Threads.find({_id: threadId});
})
