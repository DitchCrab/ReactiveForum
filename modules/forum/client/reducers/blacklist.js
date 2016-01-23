import {
  BLACKLIST_USER,
  WHITELIST_USER,
  BLACKLIST_ALL,
  WHITELIST_ALL
} from '../constants';

// List of filtered user whom you don't want to see in thread comment section
// Type: array of string
export function blacklist(state = [], action) {
  switch (action.type) {
    case BLACKLIST_USER:
      return state.concat(action.id);
    case WHITELIST_USER:
      return _.without(state, action.id);
    case BLACKLIST_ALL:
      return action.ids;
    case WHITELIST_ALL:
      return [];
    default:
      return state;
  }
}
