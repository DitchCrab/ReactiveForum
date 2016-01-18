import {
  signUp,
  signIn,
  signOut,
  authErr,
  clearAuthErr,
  getCurrentUser,
  updateUserAvatar
} from 'forum/client/actions/session';
import store from 'forum/client/store/create_store';
import UserAvatars from 'forum/collections/user_avatars';

describe('session actions', () => {
  var unsubscribe;
  afterEach(() => {
    unsubscribe();
  });

  describe('sign up', () => {
    it('failed to signup', done => {
      spyOn(Accounts, 'createUser').and.callFake((params, cb) => {
        cb(undefined);
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().authError).toEqual(null);
        done();
      });
      store.dispatch(signUp('Mock', '123'));
    });

    it('successfully sign up', done => {
      spyOn(Accounts, 'createUser').and.callFake((params, cb) => {
        cb({reason: 'Access denied'});
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().authError).toEqual('Access denied');
        done();
      });
      store.dispatch(signUp('Mock', '123'));
    })
  });

  describe('sign in', () => {
    it('failed to sign in', done => {
      spyOn(Meteor, 'loginWithPassword').and.callFake((username, password, cb) => {
        cb(undefined);
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().authError).toEqual(null);
        done();
      });
      store.dispatch(signIn('Mock', '123'));
    });

    it('successfully sign in', done => {
      spyOn(Meteor, 'loginWithPassword').and.callFake((username, password, cb) => {
        cb({reason: 'Access denied'});
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().authError).toEqual('Access denied');
        done();
      });
      store.dispatch(signIn('Mock', '123'));
    })
  });

  describe('sign out', () => {
    it('failed to sign out', done => {
      spyOn(Meteor, 'logout').and.callFake((cb) => {
        cb(undefined);
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().authError).toEqual(null);
        done();
      });
      store.dispatch(signOut('Mock', '123'));
    });

    it('successfully sign out', done => {
      spyOn(Meteor, 'logout').and.callFake((cb) => {
        cb({reason: 'Not signed out'});
      });
      unsubscribe = store.subscribe(() => {
        expect(store.getState().authError).toEqual('Not signed out');
        done();
      });
      store.dispatch(signOut('Mock', '123'));
    })
  });

  describe('update user avatar', done => {
    it('call meteor method on upload success', () => {
      spyOn(Meteor, 'call').and.callFake((name, id, cb) => {
        cb(undefined);
      });
      spyOn(UserAvatars, 'insert').and.returnValue((img, cb) => {
        cb(undefined, {_id: '123'});
      });
      unsubscribe = store.subscribe(() => {
        expect(Meteor.call).toHaveBeenCalled();
        done();        
      })
      store.dispatch(updateUserAvatar({}));
    })
  })
});

