// Actions related to browsing section on left side
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

// Open or close browsing on small screen
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

// Dynamic query & limit
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

// Set threads for browsing
export function getBrowsingThreads(threads) {
  return {
    type: BROWSING_THREADS,
    browsingThreads: threads
  }
};

// If no new threads are fetch. Set to false
// Use to stop scrolling
export function setHasMoreBrowsing(bool) {
  return {
    type: HAS_MORE_BROWSING,
    hasMoreBrowsing: bool
  }
};

// If no browsing return err
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

