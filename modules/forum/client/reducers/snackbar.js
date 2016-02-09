import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR
} from '../constants';

// Call to actions snackbar
// Type: boolean
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

export function snackbarMessage(state = 'Please log on to unlock more activities', action) {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return action.message || state;
    case CLOSE_SNACKBAR:
      return state;
    default:
      return state;
  }
};
