import featuredThreads from 'forum/client/reducers/featured_threads';
import {
  GET_FEATURED_THREADS
} from 'forum/client/constants';

describe('featuredThreads reducer', () => {
  it('should return initial state of empty array', () => {
    const reducer = featuredThreads(undefined, {});
    expect(reducer).toEqual([]);
  });

  it('should return list of threads with GET_FEATURED_THREADS', () => {
    const threads = [
      {_id: '1', title: 'hi'},
      {_id: '2', title: 'yo'},
    ];
    const reducer = featuredThreads(undefined, {
      type: GET_FEATURED_THREADS,
      featuredThreads: threads
    });
    expect(reducer).toEqual(threads);
  })
})
