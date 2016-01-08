export function getUserThreads(userId) {
  let own_threads = Threads.find({'user._id': userId}).fetch();
  let in_threads = Threads.find({comments: {$elemMatch: {userId: userId}}}).fetch();
  return {
    type: GET_USER_THREADS,
    userThreads: _.uniq(_.union(own_threads, in_threads), thread => thread._id)
  }
};

