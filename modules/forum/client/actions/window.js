// Use for responsive layout
import { WINDOW_SIZE } from '../constants';

/*
* Window size of 'small', 'medium' or 'large'
*/
export function setWindowSize(size) {
  return {
    type: WINDOW_SIZE,
    windowSize: size
  }
}
