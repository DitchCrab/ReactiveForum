import { getInitialCategories, getCategories } from 'forum/client/actions/categories';
import Categories from 'forum/collections/categories';
import store from 'forum/client/store/create_store';

describe('Categories actions', () => {
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
