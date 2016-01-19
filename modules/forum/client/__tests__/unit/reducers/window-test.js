import {windowSize} from 'forum/client/reducers/window';
import {
  WINDOW_SIZE
} from 'forum/client/constants';

describe('windowSize reducer', () => {
  it('shoudl return initial state of large', () => {
    const reducer = windowSize(undefined, {});
    expect(reducer).toEqual('large');
  });

  it('should return small with WINDOW_SIZE', () => {
    const reducer = windowSize('large', {
      type: WINDOW_SIZE,
      windowSize: 'small'
    });
    expect(reducer).toEqual('small');
  })
})
