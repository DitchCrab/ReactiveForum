import {
  GET_FEATURED_THREADS  
} from '../constants';

export default function featuredThreads(state = [], action) {
  switch (action.type) {
    case GET_FEATURED_THREADS:
      return action.featuredThreads;
    default:
      return state;
  }
}
