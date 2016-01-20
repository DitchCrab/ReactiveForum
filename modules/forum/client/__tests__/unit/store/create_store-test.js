import Store from 'forum/client/store/create_store';

describe('Redux store', () => {
  it('should create a signle store', () => {
    const store = Store.getStore();
    expect(Store.getStore()).toBe(store);
  })
})
