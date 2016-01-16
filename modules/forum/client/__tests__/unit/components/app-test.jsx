import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import {App} from 'forum/client/components/app';
import { LeftNav, IconButton, Avatar, FlatButton, AppBar, Popover, Styles } from 'material-ui';
import { SocialPerson, ActionViewList, ContentClear } from 'material-ui/lib/svg-icons';
import LeftWrapper from 'forum/client/components/left/left_wrapper';
import MiniProfile from 'forum/client/components/right/mini_profile';
import LogOn from 'forum/client/components/auth/log_on';
import { Provider } from 'react-redux';
import store from 'forum/client/store/create_store';

describe('App forum', () => {
  var foo = {
    actions: {
      setWindowSize: () => {},
      getCurrentUser: () => {},
      updateUserAvatar: () => {},
      signOut: () => {},
      pushPath: () => {},
      closeBrowsing: () => {},
      openBrowsing: () => {}
    },
    windowSize: 'large'
  };
  describe('When not login', () => {
    var root;
    beforeEach(() => {
      spyOn(Meteor, 'user').and.returnValue(null);
      root = TestUtils.renderIntoDocument(
        <App params={{}} {...foo}>
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
      root = TestUtils.renderIntoDocument(
        <App params={{}} session={{_id: '123', username: 'Tom'}} {...foo}>
          <h1>Hi</h1>
        </App>
      );
    });

    it ('should have avatar of user when user login', () => {
      const avatar = TestUtils.scryRenderedComponentsWithType(root, Avatar);
      expect(avatar.length).toEqual(1);
    });
  });

  describe('with medium screen', () => {
    var root;
    beforeEach(() => {
      foo.windowSize = 'medium';
      root = TestUtils.renderIntoDocument(
        <App params={{}} {...foo}>
          <h1>Hi</h1>
        </App>
      )
    });

    it('has SocialPerson icons on the right', () => {
      const icons = TestUtils.scryRenderedComponentsWithType(root, SocialPerson);
      expect(icons.length).toEqual(1);
    });

  })

  describe('with small screen', () => {
    var root;
    beforeEach(() => {
      foo.windowSize = 'small';
      foo.browsingOpened = false;
      root = TestUtils.renderIntoDocument(
        <App params={{}} {...foo}>
          <h1>Hi</h1>
        </App>
      )
    });

    it('has ActionViewList icon on the left', () => {
      const icons = TestUtils.scryRenderedComponentsWithType(root, ActionViewList);
      expect(icons.length).toEqual(1);
    });
  })
})
