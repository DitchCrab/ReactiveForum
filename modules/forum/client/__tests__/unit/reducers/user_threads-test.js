import userThreads from 'forum/client/reducers/user_threads';
import {
  GET_USER_THREADS
} from 'forum/client/constants';


describe('userThreads reducer', () => {
  it('should return initial state of empty array', () => {
    const reducer = userThreads(undefined, {});
    expect(reducer).toEqual([]);
  });

  it('should return array of threads with GET_USER_THREADS', () => {
    const list = [{_id: '1', title: 'yo'}, {_id: '2', title: 'ye'}];
    const reducer = userThreads(undefined, {
      type: GET_USER_THREADS,
      userThreads: list
    });
    expect(reducer).toEqual(list);
  })
})
