import onUser from 'forum/client/reducers/on_user';
import {
  GET_USER
} from 'forum/client/constants';

describe('onUser reducer', () => {
  it('should return initial state of null', () => {
    const reducer = onUser(undefined, {});
    expect(reducer).toEqual(null);
  });

  it('should return user object with GET_USER', () => {
    const user = {_id: '1', username: 'Mock'};
    const reducer = onUser(undefined, {
      type: GET_USER,
      onUser: user
    });
    expect(reducer).toEqual(user);
  })
})
