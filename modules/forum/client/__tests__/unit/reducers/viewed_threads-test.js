import {viewedThreads} from 'forum/client/reducers/viewed_thread';
import {
  ADD_VIEWED_THREAD
} from 'forum/client/constants';


describe('viewedThreads reducer', () => {
  it('should return initial state of empty array', () => {
    const reducer = viewedThreads(undefined, {});
    expect(reducer).toEqual([]);
  });

  it('should return array of threads with GET_VIEWED_THREAD', () => {
    const list = ['1', '2', '12'];
    const reducer = viewedThreads(list, {
      type: ADD_VIEWED_THREAD,
      viewedThread: '3'
    });
    expect(reducer).toEqual(['1', '2', '12', '3']);
  })
})
