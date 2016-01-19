import categories from 'forum/client/reducers/categories';
import {
  GET_CATEGORIES
} from 'forum/client/constants';

describe('categories reducer', () => {
  it('should return initial state of empty array', () => {
    const reducer = categories(undefined, {});
    expect(reducer).toEqual([]);
  });

  it('should return categories with GET_CATEGORIES', () => {
    const cats = [ {_id: '1', name: 'None'}, {_id: '2', name: 'all'}];
    const reducer = categories(undefined, {
      type: GET_CATEGORIES,
      categories: cats
    });
    expect(reducer).toEqual(cats);
  });
})
