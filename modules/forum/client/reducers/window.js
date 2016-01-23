import { WINDOW_SIZE } from '../constants';

// Window breakpoint
// Type: string ('small', 'medium', 'large')
export function windowSize(state = 'large', action) {
  switch (action.type) {
    case WINDOW_SIZE:
      return action.windowSize;
    default:
      return state;
  }
}
