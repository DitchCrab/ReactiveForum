import { getInitialCategories, getCategories } from 'forum/client/actions/categories';
import Categories from 'forum/collections/categories';
import store from 'forum/client/store/create_store';

describe('Categories actions', () => {
  describe('without subscription', () => {
    it('return undefined categories', () => {
      let res = getCategories();
      expect(res.categories.length).toEqual(0);
    })
  });

  describe('with subscription', () => {
    var unsubscribe;
    beforeEach(() => {
      window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(() => {
      unsubscribe();
    });

    it('subscribe to categories', done => {
      unsubscribe = store.subscribe(function() {
        expect(store.getState().categories.length).toBeGreaterThan(0);
        done();
      })
      store.dispatch(getInitialCategories());
    })
  })
})
