import {snackbarOpen, snackbarMessage} from 'forum/client/reducers/snackbar';
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
});

describe('snackbarMessage reducer', () => {
  it('should return initial state of message', () => {
    const reducer = snackbarMessage(undefined, {});
    expect(reducer).toEqual('Please log on to unlock more activities');
  });

  it('should return specific message with OPEN_SNACKBAR', () => {
    const reducer = snackbarMessage('yay', {
      type: OPEN_SNACKBAR,
      message: 'Please log on'
    });
    expect(reducer).toEqual('Please log on');
  });

  it('should return state with CLOSE_SNACKBAR', () => {
    const reducer = snackbarMessage('yay', {
      type: CLOSE_SNACKBAR
    });
    expect(reducer).toEqual('yay');
  });
  
})
