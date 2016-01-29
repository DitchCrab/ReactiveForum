// Use to filter users from comment sections
import {
  BLACKLIST_USER,
  WHITELIST_USER,
  BLACKLIST_ALL,
  WHITELIST_ALL
} from '../constants';

/*
* Add one user to blacklist
* @params id{string} - userId
*/
export function blacklistUser(id) {
  return {
    type: BLACKLIST_USER,
    id: id
  }
};

/*
* Remove one user from blacklist
* @params id{string} - userId
*/
export function whitelistUser(id) {
  return {
    type: WHITELIST_USER,
    id: id
  }
};

/*
* Add all users who commends in thread to blacklist
* @params ids{array} - array of userId
*/
export function blacklistAll(ids) {
  return {
    type: BLACKLIST_ALL,
    ids: ids
  }
};

/*
* Remove all users from blacklist
*/
export function whitelistAll() {
  return {
    type: WHITELIST_ALL
  }
}
