// Call to actions messages
import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR
} from '../constants';

export function openSnackbar(message) {
  return {
    type: OPEN_SNACKBAR,
    message: message
  }
};

export function closeSnackbar() {
  return {
    type: CLOSE_SNACKBAR
  }
}
