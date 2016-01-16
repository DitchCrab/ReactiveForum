import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR
} from '../constants';

export function snackbarOpen(state = false, action) {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return true;
    case CLOSE_SNACKBAR:
      return false;
    default:
      return state;
  }
};
