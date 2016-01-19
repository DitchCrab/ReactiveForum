import {
  thread,
  onReplying
} from 'forum/client/reducers/thread';
import {
  GET_THREAD,
  CREATE_REPLY,
  CLOSE_REPLY,
  OPEN_REPLY
} from 'forum/client/constants';

describe('thread reducer', () => {
  it('should return initial state of null', () => {
    const reducer = thread(undefined, {});
    expect(reducer).toEqual(null);
  });

  it('should return thread with GET_THREAD', () => {
    const mock = {_id: '1', title: 'yo'};
    const reducer = thread(undefined, {
      type: GET_THREAD,
      thread: mock
    });
    expect(reducer).toEqual(mock);
  });
});

describe('onReplying reducer', () => {
  const id = '123';
  it('should return initial state of null', () => {
    const reducer = onReplying(undefined, {});
    expect(reducer).toEqual(null);
  });

  it('should return comment id with OPEN_REPLY', () => {
    const reducer = onReplying(undefined, {
      type: OPEN_REPLY,
      commentId: id,
    });
    expect(reducer).toEqual(id);
  });

  it('should return null with CLOSE_REPLY', () => {
    const reducer = onReplying(id, {
      type: CLOSE_REPLY
    });
    expect(reducer).toEqual(null);
  });

  it('should return null with CREATE_REPLY', () => {
    const reducer = onReplying(id, {
      type: CREATE_REPLY
    });
    expect(reducer).toEqual(null);
  })
})
