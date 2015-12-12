import Threads from 'forum/collections/threads';
import ThreadImgs from 'forum/collections/thread_imgs';

Meteor.publish('threads', function() {
  return Threads.find({
    
  });
})
