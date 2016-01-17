import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import { User } from 'forum/client/components/center/lists/user';
import ThreadList from 'forum/client/components/center/lists/thread_list';
import Threads from 'forum/collections/threads';

describe('User threads', () => {
  var component;
  var foo = {
    params: {_id: '1'},
    actions: {
      getUser: () => {},
      getUserThreads: () => {},
      pushPath: () => {},
    },
    onUser: {},
    userThreads: [
      {_id: 1, title: 'None', description: 'None', imgUrl: 'None', user: {username: 'Tom'}}
    ]
  }
  beforeEach(() => {
    spyOn(Meteor.users, 'findOne');
    spyOn(Threads, 'find').and.returnValue({fetch: () => {
      return [
        {_id: '1', title: 'zzz'},
      ]
    }});
    jasmineReact.spyOnClass(User, 'viewThread');
    component = TestUtils.renderIntoDocument(
      <User {...foo}/>
    );
  });

  afterEach(() => {
    delete ReactiveDict._dictsToMigrate.onUser;
  });

  it('call meteor methods', () => {
    expect(Meteor.users.findOne).toHaveBeenCalled();
    expect(Threads.find).toHaveBeenCalled();
  });

  it('render ThreadList', () => {
    const list = TestUtils.findRenderedComponentWithType(component, ThreadList);
    expect(list).toBeDefined();
  });

  it('trigger action on callback from threadList', () => {
    const list = TestUtils.findRenderedComponentWithType(component, ThreadList);
    list.props.viewThread();
    expect(jasmineReact.classPrototype(User).viewThread).toHaveBeenCalled();
  })

})
