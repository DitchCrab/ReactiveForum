import TestUtils from 'react-addons-test-utils';
import App from 'forum/client/components/app';
import { LeftNav, IconButton, Avatar, FlatButton, AppBar, Popover, Styles } from 'material-ui';
import LeftWrapper from 'forum/client/components/left/left_wrapper';
import MiniProfile from 'forum/client/components/right/mini_profile';
import LogOn from 'forum/client/components/auth/log_on';

describe('App forum', () => {
  describe('When not login', () => {
    var root;
    beforeEach(() => {
      spyOn(Meteor, 'user').and.returnValue(null);
      root = TestUtils.renderIntoDocument(
        <App params={{}}>
          <h1>Yo</h1>
        </App>
      );
    });

    it ('do not have left nav', () => {
      const left_nav = TestUtils.scryRenderedComponentsWithType(root, LeftNav);
      expect(left_nav.length).toEqual(0);
    });
    
    it ('have app bar', () => {
      const app_bar = TestUtils.scryRenderedComponentsWithType(root, AppBar);
      expect(app_bar.length).toEqual(1);
    });

    it ('have popover', () => {
      const popover = TestUtils.findRenderedComponentWithType(root, Popover);
      expect(Popover).toBeDefined();
    });

    it ('have login button if user not login', () => {
      const button = TestUtils.findRenderedComponentWithType(root, FlatButton);
      expect(button.props.label).toContain('Log On');
    });
  });

  describe('When login', () => {
    var root;
    beforeEach(() => {
      spyOn(Meteor, 'user').and.returnValue({_id: '123', username: 'Tom'});
      root = TestUtils.renderIntoDocument(
        <App params={{}}>
          <h1>Hi</h1>
        </App>
      );
    });

    it ('should have avatar of user when user login', () => {
      const avatar = TestUtils.scryRenderedComponentsWithType(root, Avatar);
      expect(avatar.length).toEqual(1);
    });
  })
})
