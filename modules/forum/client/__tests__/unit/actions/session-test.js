import {
  signUp,
  signIn,
  signOut,
  authErr,
  clearAuthErr,
  getCurrentUser,
  updateAvatar
} from 'forum/client/actions/session';
import store from 'forum/client/store/create_store';

describe('session actions', () => {
  beforeEach(() => {
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  describe('when user not exist', () => {
    var unsubscribe;
    beforeEach(done => {
      Meteor.call('fixtures/remove_user', 'test_user', (err, res) => {
        done();
      })
    });
    
    afterEach(done => {
      unsubscribe();
      Meteor.call('fixtures/remove_user', 'test_user', (err, res) => {
        done();
      })
    });

    it('sign up return no auth error', done => {
      unsubscribe = store.subscribe(function() {
        expect(store.getState().authError).toEqual(null);
        done();
      });
      store.dispatch(signUp('test_user', '12345'));
    });

    it('sign in return auth error', done => {
      unsubscribe = store.subscribe(function() {
        expect(store.getState().authError).toEqual('User not found');
        done();
      });
      store.dispatch(signIn('test_user', '12345'));
    })
  });

  describe('when user exist', () => {
    var unsubscribe;
    beforeEach(done => {
      Accounts.createUser({username: 'test_user', password: '12345'}, (err) => {
        done();
      })
    });

    afterEach(done => {
      unsubscribe();
      Meteor.call('fixtures/remove_user', 'test_user', (err, res) => {
        done();
      })
    });

    it('sign up has auth error', done => {
      unsubscribe = store.subscribe(function() {
        expect(store.getState().authError).toEqual('Username already exists.');
        done();
      });
      store.dispatch(signUp('test_user', '12345'));
    });

    it('sign in return auth error', done => {
      unsubscribe = store.subscribe(function() {
        expect(store.getState().authError).toEqual(null);
        done();
      });
      store.dispatch(signIn('test_user', '12345'));
    });

    it('signout user successfully', done => {
      unsubscribe = store.subscribe(function() {
        expect(store.getState().authError).toEqual(null);
        done();
      });
      store.dispatch(signIn('test_user', '12345'));
      store.dispatch(signOut());
    });

  })
});

