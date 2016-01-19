import session from 'forum/client/reducers/session';
import {
  USER_SESSION
} from 'forum/client/constants';

describe('session reducer', () => {
  it('should return initial state of null', () => {
    const reducer = session(undefined, {});
    expect(reducer).toEqual(null);
  });

  it('should return user session with USER_SESSION', () => {
    const user = {_id: '1', username: 'Mock'};
    const reducer = session(undefined, {
      type: USER_SESSION,
      currentUser: user
    });
    expect(reducer).toEqual(user);
  })
})
