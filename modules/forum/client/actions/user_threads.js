import Threads from 'forum/collections/threads';
import { GET_USER_THREADS } from '../constants';

export function getUserThreads(threads) {
  return {
    type: GET_USER_THREADS,
    userThreads: threads
  }
};

