export function getBrowsingThreads(query, limit) {
  if (store.getState().browsingObserver) {
    store.getState().browsingObserver.stop();
  }
  let threads = Threads.find(query, {sort: {createdAt: -1}, limit: limit});
  let cursor = threads.observe({
    changed: (oldThreads, newThreads) => {
      store.dispatch(browsingThreadsChanged(newThreads));
    }
  });
  return {
    type: GET_BROWSING_THREADS,
    browsingThreads: threads.fetch(),
    browsingObserver: cursor,
  }
};

export function browsingThreadsChanged(threads) {
  return {
    type: BROWSING_THREADS_CHANGED,
    browsingThreads: threads
  }
};

export function removeBrowsingThreads() {
  if (store.getState().browsingObserver) {
    store.getState().browsingObserver.stop();
  }
  return {
    type: REMOVE_BROWSING_THREADS,
  }
};
