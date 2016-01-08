import {
  GET_FEATURED_USERS,
  FEATURED_USERS_CHANGED,
  REMOVE_FEATURED_USERS
} from '../constants';

export default function featuredUsers(state = GET_FEATURED_USERS, action) {
  switch (action.type) {
    case GET_FEATURED_USERS:
    case FEATURED_USERS_CHANGED:
      return action.featuredUsers;
    case REMOVE_FEATURED_USERS:
      return null;
    default:
      return state;
  }
}
