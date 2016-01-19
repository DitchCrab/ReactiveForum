import {snackbarOpen} from 'forum/client/reducers/snackbar';
import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR
} from 'forum/client/constants';

describe('snackbarOpen reducer', () => {
  it('should return initial state of false', () => {
    const reducer = snackbarOpen(undefined, {});
    expect(reducer).toEqual(false);
  });

  it('should return true with OPEN_SNACKBAR', () => {
    const reducer = snackbarOpen(false, {
      type: OPEN_SNACKBAR
    });
    expect(reducer).toEqual(true);
  });

  it('should return false with CLOSE_SNACKBAR', () => {
    const reducer = snackbarOpen(true, {
      type: CLOSE_SNACKBAR
    });
    expect(reducer).toEqual(false);
  })
})
