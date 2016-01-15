import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import ThreadUsers from 'forum/client/components/right/thread_users';
import { List, ListItem, Checkbox, FlatButton, Avatar } from 'material-ui';

describe('thread users', () => {
  var component;
  var foo = {
    updateBlackList: () => {return 1;},
    onUser: () => {return 2;}
  };
  
  beforeEach(() => {
    const threadUsers = ['1', '2']
    spyOn(Meteor.users, 'find').and.returnValue({
      fetch: function() {
        return ([
          {_id: 1, username: 'Tom'},
          {_id: 2, username: 'Zoe'}
        ]);
      } 
    });
    jasmineReact.spyOnClass(ThreadUsers, 'linkToUserPost');
    jasmineReact.spyOnClass(ThreadUsers, 'filterUser');
    jasmineReact.spyOnClass(ThreadUsers, 'makeSelection');
    component = TestUtils.renderIntoDocument(
      <ThreadUsers threadUsers={threadUsers} {...foo}/>
    )
  });

  it('has a list of two users', () => {
    const users = TestUtils.scryRenderedComponentsWithType(component, ListItem);
    expect(users.length).toEqual(2);
  });

  it('has two buttons', () => {
    const buttons = TestUtils.scryRenderedComponentsWithType(component, FlatButton);
    expect(buttons.length).toEqual(2);
    expect(buttons[0].props.label).toEqual('All');
    expect(buttons[1].props.label).toEqual('None');
  });

  it('trigger lnkToUserPost function when clicked on avatar of user', () => {
    const avatar = TestUtils.scryRenderedComponentsWithType(component, Avatar)[0];
    TestUtils.Simulate.click(ReactDOM.findDOMNode(avatar));
    expect(jasmineReact.classPrototype(ThreadUsers).linkToUserPost.calls.count()).toEqual(1);
  });

  it('trigger filterUser function when check on user', () => {
    const checkbox = TestUtils.scryRenderedComponentsWithType(component, Checkbox)[0];
    checkbox.props.onCheck();
    expect(jasmineReact.classPrototype(ThreadUsers).filterUser.calls.count()).toEqual(1);
    expect(jasmineReact.classPrototype(ThreadUsers).filterUser.calls.argsFor(0)[0]).toEqual(1);
  });

  it('select all on click button', () => {
    const button = TestUtils.scryRenderedComponentsWithType(component, FlatButton)[0];
    TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
    expect(jasmineReact.classPrototype(ThreadUsers).makeSelection.calls.argsFor(0)[0]).toEqual(true);
  });

  it('select none on click button', () => {
    const button = TestUtils.scryRenderedComponentsWithType(component, FlatButton)[1];
    TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
    expect(jasmineReact.classPrototype(ThreadUsers).makeSelection.calls.argsFor(0)[0]).toEqual(false);
  })
});
