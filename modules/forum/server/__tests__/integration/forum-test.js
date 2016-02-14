import ThreadImgs from 'forum/collections/thread_imgs';
import UserAvatars from 'forum/collections/user_avatars';
import Threads from 'forum/collections/threads';
import Categories from 'forum/collections/categories';

describe('Server integration test', () => {
  describe('updateAvatar', () => {
    const id = '12345';
    beforeEach(() => {
      spyOn(UserAvatars, 'find').and.returnValue({observe: () => {}});
    });

    it('shoud throw meteor error', done => {
      Meteor.call('updateAvatar', (err, res) => {
        expect(err.reason).toEqual('Access denied');
        done();
      });
    });

    it('should update user avatar', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: '1'});
      Meteor.call('updateAvatar', id,  (err, res) => {
        expect(UserAvatars.find).toHaveBeenCalled();
        expect(res).toEqual(id);
        done();
      });
    });
  });


  describe('createThread', () => {
    var params = {
      category: '123',
      title: 'Mock',
      description: 'Mock text',
      tags: 'hi, there',
    };

    beforeEach(() => {
      spyOn(Meteor.users, 'update').and.callFake((query, args) => {});
      spyOn(ThreadImgs, 'find').and.returnValue({observe: () => {}});
    });

    afterEach(done => {
      Meteor.call('delete_thread', () => {
        done();
      })      
    });
    
    it('shoud throw meteor error', done => {
      Meteor.call('createThread', params, (err, res) => {
        expect(err.reason).toEqual('Access denied');
        done();
      });
    });

    it('should create new thread', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: '1'});
      Meteor.call('createThread', params,  (err, res) => {
        expect(res).toBeDefined();
        done();
      })
    });

    it('should throw error of validation', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: '1'});
      params.title = null;
      Meteor.call('createThread', params,  (err, res) => {
        expect(res).toBeUndefined();
        done();
      })
    });
  });

  describe('thread test', () => {
    
  })
  describe('editThread', () => {
    var id;
    var thread;
    beforeEach(done => {
      Meteor.call('fixtures/create_thread', (err, res) => {
        id = res;
        thread = Threads.findOne({_id: id});
        done();
      })
    });

    afterEach(done => {
      Meteor.call('fixtures/delete_thread', () => {
        done();
      })
    });

    it('should throw meteor error when user is not present', done => {
      Meteor.call('editThread', id, {}, (err, res) => {
        expect(err.reason).toEqual('Access denied');
        done();
      })
    });

    it('should throw meteor error when user is not thread owner', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: '1'});
      Meteor.call('editThread', id, {}, (err, res) => {
        expect(err.reason).toEqual('Access denied');
        done();
      })
    });

    it('should edit thread', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: thread.user._id});
      Meteor.call('editThread', id, {description: 'yo'}, (err, res) => {
        expect(res).toEqual(id);
        done();
      })
    });

    it('should not edit thread with blank value', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: thread.user._id});
      Meteor.call('editThread', id, {description: ''}, (err, res) => {
        expect(res).toBeUndefined();
        done();
      })
    });
  });

  describe('thread methods', () => {
    var id;
    var thread;
    beforeEach(done => {
      Meteor.call('fixtures/create_thread', (err, res) => {
        id = res;
        thread = Threads.findOne({_id: id});
        done();
      })
    });

    afterEach(done => {
      Meteor.call('fixtures/delete_thread', () => {
        done();
      })
    });

    describe('likeThread', () => {
      it('should return meteor error when user is not signin', done => {
        Meteor.call('likeThread', id, (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should like thread when user is signin', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        Meteor.call('likeThread', id, (err, res) => {
          expect(res).toEqual(1);
          done();
        })
      });
    });

    describe('createComment', () => {
      it('should return meteor error when user is not signin', done => {
        Meteor.call('createComment', id, 'Hello', (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should return commentId when user is signin', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        spyOn(Meteor.users, 'update').and.returnValue();
        Meteor.call('createComment', id, 'Hello', (err, res) => {
          expect(res).toBeDefined();
          expect(Meteor.users.update).toHaveBeenCalled();
          done();
        })
      });

    });

    describe('updateComment', () => {
      let commentId = '123';
      it('should return meteor error when user is not signin', done => {
        Meteor.call('updateComment', id, commentId, 'Hi', (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should return meteor error when user is not comment owner', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '2'});
        Meteor.call('updateComment', id, commentId, 'Hi', (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should update comment', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        Meteor.call('updateComment', id, commentId, 'Hi', (err, res) => {
          expect(err).toBeUndefined();
          done();
        })
      })
    });

    describe('likeComment', () => {
      let commentId = '123';
      it('should return meteor error when user is not signin', done => {
        Meteor.call('likeComment', id, commentId, (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should like comment', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        Meteor.call('likeComment', id, commentId, (err, res) => {
          expect(err).toBeUndefined();
          done();
        })
      })
    });

    describe('createReply', () => {
      let commentId = '123';
      it('should return meteor error when user is not signin', done => {
        Meteor.call('createReply', id, commentId, 'Yo', (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should create reply', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        spyOn(Meteor.users, 'update').and.returnValue();
        Meteor.call('createReply', id, commentId, 'Yo', (err, res) => {
          expect(res).toBeDefined();
          done();
        })
      });

    });

    describe('updateReply', () => {
      let commentId = '123';
      it('should return meteor error when user is not signin', done => {
        Meteor.call('updateReply', id, commentId, 0, 'Yeah', (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should return meteor error when user is not owner of reply', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '2'});
        Meteor.call('updateReply', id, commentId, 0, 'Yeah', (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should update reply', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        Meteor.call('updateReply', id, commentId, 0, 'Yeah', (err, res) => {
          expect(res).toBeDefined();
          done();
        })
      })
    });

    describe('likeReply', () => {
      let commentId = '123';
      it('should return meteor error when user is not signin', done => {
        Meteor.call('likeReply', id, commentId, 0, (err, res) => {
          expect(err.reason).toEqual('Access denied');
          done();
        })
      });

      it('should like reply', done => {
        spyOn(Meteor, 'user').and.returnValue({_id: '1'});
        Meteor.call('likeReply', id, commentId, 0, (err, res) => {
          expect(res).toBeDefined();
          done();
        })
      });
    });
  })
})
