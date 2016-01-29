// Featured threads
import {
  GET_FEATURED_THREADS
} from '../constants';

/*
* Get featured threads
* @params threads{arrayOf(object)}
*/
export function getFeaturedThreads(threads) {
  return {
    type: GET_FEATURED_THREADS,
    featuredThreads: threads
  }
};
