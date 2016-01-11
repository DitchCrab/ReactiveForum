import { WINDOW_SIZE } from '../constants';

export function windowSize(state = 'large', action) {
  switch (action.type) {
    case WINDOW_SIZE:
      return action.windowSize;
    default:
      return state;
  }
}
