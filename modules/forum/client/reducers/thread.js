import {
  GET_THREAD,
} from '../constants';

export default function thread(state = null, action) {
  switch (action.type) {
    case GET_THREAD:
      return action.thread;
    default:
      return state;
  }
}
