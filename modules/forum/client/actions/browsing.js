import Threads from 'forum/collections/threads';
import {
  OPEN_BROWSING,
  CLOSE_BROWSING,
  SET_BROWSING_QUERY,
  SET_BROWSING_LIMIT,
  BROWSING_THREADS,
  HAS_MORE_BROWSING,
  SEARCH_ERROR,
  RESET_SEARCH
} from '../constants';

export function openBrowsing() {
  return {
    type: OPEN_BROWSING
  }
};

export function closeBrowsing() {
  return {
    type: CLOSE_BROWSING
  }
};

export function setBrowsingQuery(query) {
  return {
    type: SET_BROWSING_QUERY,
    browsingQuery: query
  }
};

export function setBrowsingLimit(limit) {
  return {
    type: SET_BROWSING_LIMIT,
    browsingLimit: limit
  }
};

export function getBrowsingThreads(threads) {
  return {
    type: BROWSING_THREADS,
    browsingThreads: threads
  }
};

export function setHasMoreBrowsing(bool) {
  return {
    type: HAS_MORE_BROWSING,
    hasMoreBrowsing: bool
  }
};

export function setSearchErr(err) {
  return {
    type: SEARCH_ERROR,
    searchError: err
  }
};

export function resetSearch() {
  return {
    type: RESET_SEARCH,
  }
}

