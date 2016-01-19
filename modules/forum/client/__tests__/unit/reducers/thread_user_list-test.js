import {threadUserList} from 'forum/client/reducers/thread_user_list';
import {
  GET_THREAD_USER_LIST
} from 'forum/client/constants';

describe('threadUserList reducer', () => {
  it('should return initial state of empty array', () => {
    const reducer = threadUserList(undefined, {});
    expect(reducer).toEqual([]);
  });

  it('should return list of users on GET_THREAD_USER_LIST', () => {
    const list = ['1', '2', '123'];
    const reducer = threadUserList(undefined, {
      type: GET_THREAD_USER_LIST,
      list: list
    });
    expect(reducer).toEqual(list);
  })
})
