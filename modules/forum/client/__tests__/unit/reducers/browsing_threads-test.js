import {
  browsingOpened,
  browsingThreads,
  browsingLimit,
  browsingQuery,
  hasMoreBrowsing
} from 'forum/client/reducers/browsing_threads';
import {
  OPEN_BROWSING,
  CLOSE_BROWSING,
  SET_BROWSING_QUERY,
  SET_BROWSING_LIMIT,
  BROWSING_THREADS,
  HAS_MORE_BROWSING,
  RESET_SEARCH,
} from 'forum/client/constants';
import { UPDATE_PATH } from 'redux-simple-router';

describe('browsingOpened reducer', () => {
  it('shoulld return initial state with false', () => {
    const reducer = browsingOpened(undefined, {});
    expect(reducer).toEqual(false);
  });

  it('should return true with OPEN_BROWSING action', () => {
    const reducer = browsingOpened(false, {
      type: OPEN_BROWSING,
    });
    expect(reducer).toEqual(true);
  });

  it('should return false with CLOSE_BROWSING action', () => {
    const reducer = browsingOpened(true, {
      type: CLOSE_BROWSING
    });
    expect(reducer).toEqual(false);
  });

  it('should return false with UPDATE_PATH action', () => {
    const reducer = browsingOpened(true, {
      type: UPDATE_PATH,
    });
    expect(reducer).toEqual(false);
  })
});

describe('browsingThreads reducer', () => {
  const threads = [
    {_id: '1'},
    {_id: '2'},
    {_id: '3'}
  ];
  
  it('should return initial threads', () => {
    const reducer = browsingThreads(undefined, {});
    expect(reducer).toEqual([]);
  });

  it('should return threads list with BROWSING_THREADS action', () => {
    const reducer = browsingThreads([], {
      type: BROWSING_THREADS,
      browsingThreads: threads,
    });
    expect(reducer).toEqual(threads);
  });
});

describe('browsingLimit reducer', () => {
  it('should return initial limit of ten', () => {
    const reducer = browsingLimit(undefined, {});
    expect(reducer).toEqual(10);
  });

  it('should return limit of twenty with SET_BROWSING_LIMIT', () => {
    const reducer = browsingLimit(10, {
      type: SET_BROWSING_LIMIT,
      browsingLimit: 20,
    });
    expect(reducer).toEqual(20);
  });

  it('should return limit of 10 with RESET_SEARCH', () => {
    const reducer = browsingLimit(30, {
      type: RESET_SEARCH,
    });
    expect(reducer).toEqual(10);
  });
});

describe('browsingQuery reducer', () => {
  const query = {username: 'Bon'};
  it('should return initial query of empty hash', () => {
    const reducer = browsingQuery(undefined, {});
    expect(reducer).toEqual({});
  });

  it('should return new query with SET_BROWSING_QUERY', () => {
    const reducer = browsingQuery({}, {
      type: SET_BROWSING_QUERY,
      browsingQuery: query
    });
    expect(reducer).toEqual(query);
  });

  it('should return empty hash with RESET_SEARCH', () => {
    const reducer = browsingQuery(query, {
      type: RESET_SEARCH,
    });
    expect(reducer).toEqual({});
  })
});

describe('hasMoreBrowsing reducer', () => {
  it('should return initial state of true', () => {
    const reducer = hasMoreBrowsing(undefined, {});
    expect(reducer).toEqual(true);
  });

  it('should return false with HAS_MORE_BROWSING and false', () => {
    const reducer = hasMoreBrowsing(true, {
      type: HAS_MORE_BROWSING,
      hasMoreBrowsing: false
    });
    expect(reducer).toEqual(false);
  })
})
