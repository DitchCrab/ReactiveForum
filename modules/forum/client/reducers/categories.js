import {
  GET_CATEGORIES  
} from '../constants';

// Categories used to filter browsing threads
// Type: array
export default function categories(state = [], action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
}
