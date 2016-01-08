import {
  GET_BROWSING_THREADS,
  BROWSING_THREADS_CHANGED,
  REMOVE_BROWSING_THREADS
} from '../constants';

export default  function browsingThreads(state = GET_BROWSING_THREADS, action) {
  switch (action.type) {
    case GET_BROWSING_THREADS:
    case BROWSING_THREADS_CHANGED:
      return action.browsingThreads;
    case REMOVE_BROWSING_THREADS:
      return null;
    default:
      return state;
  }
}
