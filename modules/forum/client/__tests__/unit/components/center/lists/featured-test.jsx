import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import { Featured } from 'forum/client/components/center/lists/featured';
import ThreadList from 'forum/client/components/center/lists/thread_list';
import Threads from 'forum/collections/threads';

describe('Featured', () => {
  var component;
  var foo = {
    actions: {
      getFeaturedThreads: () => {},
      pushPath: () => {},
    },
    featuredThreads: [
      {_id: 1, title: 'None', description: 'None', imgUrl: 'None', user: {username: 'Tom'}}
    ]
  }
  beforeEach(() => {
    spyOn(Threads, 'find').and.returnValue({fetch: () => {}});
    jasmineReact.spyOnClass(Featured, 'viewThread');
    component = TestUtils.renderIntoDocument(
      <Featured {...foo}/>
    );
  });

  it('call Threads fetch', () => {
    expect(Threads.find).toHaveBeenCalled();
  });

  it('render ThreadList', () => {
    const list = TestUtils.findRenderedComponentWithType(component, ThreadList);
    expect(list).toBeDefined();
  });

  it('trigger action on callback from threadList', () => {
    const list = TestUtils.findRenderedComponentWithType(component, ThreadList);
    list.props.viewThread();
    expect(jasmineReact.classPrototype(Featured).viewThread).toHaveBeenCalled();
  })

})
