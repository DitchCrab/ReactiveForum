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

/*
* Dynamic query & limit
* @params query{object} - Mongo query
*/
export function setBrowsingQuery(query) {
  return {
    type: SET_BROWSING_QUERY,
    browsingQuery: query
  }
};

/*
* Set browsing limit of query
* @params limit{number}
*/
export function setBrowsingLimit(limit) {
  return {
    type: SET_BROWSING_LIMIT,
    browsingLimit: limit
  }
};

/*
* Set browing thread
* @params threads{arrayOf{object}
*/
export function getBrowsingThreads(threads) {
  return {
    type: BROWSING_THREADS,
    browsingThreads: threads
  }
};

/*
* Set if more threads are fetch
* @params bool{boolean}
*/
export function setHasMoreBrowsing(bool) {
  return {
    type: HAS_MORE_BROWSING,
    hasMoreBrowsing: bool
  }
};

/* 
* If no browsing return err
* @params err{string}
*/
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

