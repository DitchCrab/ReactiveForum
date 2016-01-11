import {
  BLACKLIST_USER,
  WHITELIST_USER,
  BLACKLIST_ALL,
  WHITELIST_ALL
} from '../constants';

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
