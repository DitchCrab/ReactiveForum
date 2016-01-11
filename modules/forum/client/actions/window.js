import { WINDOW_SIZE } from '../constants';

export function setWindowSize(size) {
  return {
    type: WINDOW_SIZE,
    windowSize: size
  }
}
