import {
  createThread,
  editThread,
  createThreadErr,
  clearThreadErr,
  getThread,
  likeThread,
  createComment,
  notifyNewComment,
  updateComment,
  createReply,
  notifyNewReplyHash,
  updateReply,
  likeReply,
  likeComment,
  flagThread,
  unflagThread,
  openReply,
  closeReply
} from 'forum/client/actions/thread';
import store from 'forum/client/store/create_store';

describe('thread actions', () => {
  var unsubscribe;
  beforeEach(() => {
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  
  afterEach(() => {
    unsubscribe();
  });

  describe('create thread', () => {
    it('successfully create thread', done => {
      spyOn(Meteor, 'call').and.callFake((name, params, cb) => {
        cb(undefined, '1');
      });
      unsubscribe = store.subscribe(function() {
        expect(store.getState().createThreadError).toEqual(null);
        done();
      });
      store.dispatch(createThread({}));      
    });

    it('fail to create thread', done => {
      spyOn(Meteor, 'call').and.callFake((name, params, cb) => {
        cb({reason: 'Access denied'});
      });
      unsubscribe = store.subscribe(function() {
        expect(store.getState().createThreadError).toEqual('Access denied');
        done();
      });
      store.dispatch(createThread({}));      
    })
  });

  describe('edit thread', () => {
    it('successfully edit thread', done => {
      spyOn(Meteor, 'call').and.callFake((name, id, params, cb) => {
        cb(undefined, '1');
      });
      unsubscribe = store.subscribe(function() {
        expect(store.getState().createThreadError).toEqual(null);
        done();
      });
      store.dispatch(editThread('123', {}));      
    });

    it('fail to edit thread', done => {
      spyOn(Meteor, 'call').and.callFake((name, id, params, cb) => {
        cb({reason: 'Access denied'});
      });
      unsubscribe = store.subscribe(function() {
        expect(store.getState().createThreadError).toEqual('Access denied');
        done();
      });
      store.dispatch(editThread('123', {}));      
    })
  });

  describe('createComment', () => {
    it('successfully create comment', done => {
      spyOn(Meteor, 'call').and.callFake((name, id, comment, cb) => {
        cb(undefined, '123');
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().newCommentId).toEqual('123');
        done();
      });
      store.dispatch(createComment('1', 'Done'));
    })
  });

  describe('createReply', () => {
    it('successfully create reply', done => {
      spyOn(Meteor, 'call').and.callFake((name, id, commentId, reply, cb) => {
        cb(undefined, '123');
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().newReplyHash).toEqual({commentId: '321', replyIndex: '123'});
        done();
      });
      store.dispatch(createReply('1', '321', 'Done'));
    })
  })
});

 
