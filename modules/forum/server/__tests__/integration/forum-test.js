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
      tags: ['hi', 'there'],
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

  describe('editThread', () => {
    var id;
    beforeEach(done => {
      Meteor.call('fixtures/create_thread', (err, res) => {
        id = res;
        done();
      })
    });

    afterEach(done => {
      Meteor.call('fixtures/delete_thread', () => {
        done();
      })
    });

    it('should throw meteor error', done => {
      Meteor.call('editThread', id, {}, (err, res) => {
        expect(err.reason).toEqual('Access denied');
        done();
      })
    });

    it('should edit thread', done => {
      spyOn(Meteor, 'user').and.returnValue({_id: '1'});
      Meteor.call('editThread', id, {description: 'yo'}, (err, res) => {
        expect(res).toEqual(id);
        done();
      })
    })
  })
})
