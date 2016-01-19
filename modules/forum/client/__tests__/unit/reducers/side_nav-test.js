import {sideNavOpened} from 'forum/client/reducers/side_nav';
import {
  OPEN_SIDE_NAV,
  CLOSE_SIDE_NAV,
  GET_USER_THREADS,
  GET_FEATURED_THREADS,
} from 'forum/client/constants';

describe('sideNavOpened reducer', () => {
  it('should return initial state of false', () => {
    const reducer = sideNavOpened(undefined, {});
    expect(reducer).toEqual(false);
  });

  it('should return true with OPEN_SIDE_NAV', () => {
    const reducer = sideNavOpened(undefined, {
      type: OPEN_SIDE_NAV
    });
    expect(reducer).toEqual(true);
  });

  it('should return false with CLOSE_SIDE_NAV', () => {
    const reducer = sideNavOpened(true, {
      type: CLOSE_SIDE_NAV
    });
    expect(reducer).toEqual(false);
  });

  it('should return false with GET_USER_THREADS', () => {
    const reducer = sideNavOpened(true, {
      type: GET_USER_THREADS
    });
    expect(reducer).toEqual(false);
  });

  it('should return false with GET_FEATURED_THREADS', () => {
    const reducer = sideNavOpened(true, {
      type: GET_FEATURED_THREADS
    });
    expect(reducer).toEqual(false);
  })
})
