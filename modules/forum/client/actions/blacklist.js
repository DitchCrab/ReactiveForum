// Use to filter users from comment sections
import {
  BLACKLIST_USER,
  WHITELIST_USER,
  BLACKLIST_ALL,
  WHITELIST_ALL
} from '../constants';

export function blacklistUser(id) {
  return {
    type: BLACKLIST_USER,
    id: id
  }
};

export function whitelistUser(id) {
  return {
    type: WHITELIST_USER,
    id: id
  }
};

export function blacklistAll(ids) {
  return {
    type: BLACKLIST_ALL,
    ids: ids
  }
};

export function whitelistAll() {
  return {
    type: WHITELIST_ALL
  }
}
