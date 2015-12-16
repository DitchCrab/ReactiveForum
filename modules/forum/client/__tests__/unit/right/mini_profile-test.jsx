import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import MiniProfile from 'forum/client/right/mini_profile';
import { Avatar, List, ListItem } from 'material-ui';

describe('Mini Profile', () => {
  var component;
  beforeEach(() => {
    spyOn(Meteor, 'user').and.returnValue({_id: 1, username: 'Tom'});
    jasmineReact.spyOnClass(MiniProfile, 'userLogout');
    component = TestUtils.renderIntoDocument(
      <MiniProfile />
    )
  });

  it('display greeting message', () => {
    const greeting = TestUtils.findRenderedDOMComponentWithClass(component, 'greeting-user');
    expect(greeting.innerText).toEqual('Hello Tom');
  });

  it('sign out user', () => {
    const signout = TestUtils.scryRenderedComponentsWithType(component, ListItem);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(signout[1]).getElementsByTagName('a')[0]);
    expect(jasmineReact.classPrototype(MiniProfile).userLogout.calls.count()).toEqual(1);
  })
});
