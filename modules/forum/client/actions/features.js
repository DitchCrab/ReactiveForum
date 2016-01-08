export function getFeaturedThreads() {
  let threads = Threads.find({}, {sort: {likes: -1}, limit: 20}).fetch();
  return {
    type: GET_FEATURED_THREADS,
    featuredThreads: threads
  }
};
