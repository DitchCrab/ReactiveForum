import {blacklist} from 'forum/client/reducers/blacklist';
import {
  BLACKLIST_USER,
  WHITELIST_USER,
  BLACKLIST_ALL,
  WHITELIST_ALL
} from 'forum/client/constants';

describe('blacklist reducer', () => {
  it('should return initial state', () => {
    expect(blacklist(undefined, {})).toEqual([]);
  });

  it('should add one to blacklist', () => {
    expect(blacklist([], {
      type: BLACKLIST_USER,
      id: '1'
    })).toEqual(['1']);
  });

  it('should remove one from blacklist', () => {
    expect(blacklist(['1', '2', 'hi', '3'], {
      type: WHITELIST_USER,
      id: 'hi'
    })).toEqual(['1', '2', '3']);
  });

  it('should add all users to blacklist', () => {
    const list = ['1', '2', '3', 'yo'];
    expect(blacklist([], {
      type: BLACKLIST_ALL,
      ids: list
    })).toEqual(list);
  });

  it('should remove all users from blacklist', () => {
    const list = ['1', '2', '3', 'yo'];
    expect(blacklist(list, {
      type: WHITELIST_ALL,
    })).toEqual([]);
  })
})
