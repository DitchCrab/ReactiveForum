import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import MiniProfile from 'forum/client/components/right/mini_profile';
import { Avatar, List, ListItem } from 'material-ui';

describe('Mini Profile', () => {
  var component;
  var foo = {
    signOut: () => {},
    updateUserAvatar: () => {}
  };
  beforeEach(() => {
    spyOn(foo, 'signOut');
    const currentUser = {
      _id: 1,
      username: 'Tom'
    };
    component = TestUtils.renderIntoDocument(
      <MiniProfile currentUser={currentUser} {...foo}/>
    )
  });

  it('display greeting message', () => {
    const greeting = TestUtils.findRenderedDOMComponentWithClass(component, 'greeting-user');
    expect(greeting.innerText).toEqual('Hello Tom');
  });

  it('sign out user', () => {
    const signout = TestUtils.scryRenderedComponentsWithType(component, ListItem);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(signout[1]).getElementsByTagName('span')[0]);
    expect(foo.signOut.calls.count()).toEqual(1);
  })
});
