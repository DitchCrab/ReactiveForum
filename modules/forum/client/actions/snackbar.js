// Call to actions messages
import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR
} from '../constants';

export function openSnackbar() {
  return {
    type: OPEN_SNACKBAR
  }
};

export function closeSnackbar() {
  return {
    type: CLOSE_SNACKBAR
  }
}
