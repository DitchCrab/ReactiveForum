import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import Featured from 'forum/client/components/center/lists/featured';
import ThreadList from 'forum/client/components/center/lists/thread_list';
import { List, ListItem, IconButton } from 'material-ui';
import Threads from 'forum/collections/threads';
import { Provider } from 'react-redux';
import store from 'forum/client/store/create_store';

describe('Featured', () => {
  var component;
  beforeEach(() => {
//    jasmineReact.spyOnClass(Featured, 'viewThread');
    const threads = [
      {_id: 1, title: 'None', description: 'None', imgUrl: 'None', user: {username: 'Tom'}}
    ];
    spyOn(Threads, 'find').and.returnValue({fetch: () => { return threads;}});
    component = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Featured />
      </Provider>
    );
  });

  it('render ThreadList', () => {
    const list = TestUtils.findRenderedComponentWithType(component, ThreadList);
    expect(list).toBeDefined();
  });

  /* it('trigger action on callback from threadList', () => {
     const list = TestUtils.findRenderedComponentWithType(component, ThreadList);
     list.viewThread();
     expect(jasmineReact.classPrototype(Featured).viewThread).toHaveBeenCalled();
     }) */

})
