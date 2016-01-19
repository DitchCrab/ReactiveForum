import {
  newCommentId,
  newReplyHash
} from 'forum/client/reducers/notifications';
import {
  CREATE_REPLY,
  CREATE_COMMENT
} from 'forum/client/constants';

describe('newCommentId reducer', () => {
  it('should return initial state of null', () => {
    const reducer = newCommentId(undefined, {});
    expect(reducer).toEqual(null);
  });

  it('should return new comment id with CREATE_COMMENT', () => {
    const id = '123';
    const reducer = newCommentId(undefined, {
      type: CREATE_COMMENT,
      newCommentId: id
    });
    expect(reducer).toEqual(id);
  })
});

describe('newReplyHash reducer', () => {
  it('should return initial state of emply hash', () => {
    const reducer = newReplyHash(undefined, {});
    expect(reducer).toEqual({});
  });

  it('should return hash of comment id and reply index with CREATE_REPLY', () => {
    const hash = {commentId: '1', replyIndex: '1'};
    const reducer = newReplyHash(undefined, {
      type: CREATE_REPLY,
      newReplyHash: hash
    });
    expect(reducer).toEqual(hash);
  })
})
