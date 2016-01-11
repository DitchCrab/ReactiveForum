import {
  GET_FEATURED_THREADS
} from '../constants';

export function getFeaturedThreads(threads) {
  return {
    type: GET_FEATURED_THREADS,
    featuredThreads: threads
  }
};
