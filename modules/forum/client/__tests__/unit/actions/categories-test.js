import { getInitialCategories, getCategories } from 'forum/client/actions/categories';
import Categories from 'forum/collections/categories';
import Store from 'forum/client/store/create_store';

describe('Categories actions', () => {
  let store = Store.getStore();
  var unsubscribe;
  afterEach(() => {
    unsubscribe();
  });

  it('subscribe to categories', done => {
    spyOn(Meteor, 'subscribe').and.callFake((name, cb) => {
      cb(undefined);
    });
    spyOn(Categories, 'find').and.returnValue({fetch: () => {return [{}, {}, {}]}});
    unsubscribe = store.subscribe(() => {
      expect(store.getState().categories.length).toEqual(3);
      done();
    });
    store.dispatch(getInitialCategories());
  });

})
