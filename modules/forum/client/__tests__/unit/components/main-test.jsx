import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import {Main} from 'forum/client/components/main';
import LeftWrapper from 'forum/client/components/left/left_wrapper';
import ThreadUsers from 'forum/client/components/right/thread_users';
import ThreadForm from 'forum/client/components/center/lists/thread_form';
import FeaturedUsers from 'forum/client/components/right/featured_users';
import { Dialog, FlatButton } from 'material-ui';
import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';

describe('main', () => {
  beforeEach(() => {
    delete ReactiveDict._dictsToMigrate.browsing;
  });
  var foo = {
    actions: {
      getInitialCategories: () => {},
      setSearchErr: () => {},
      getBrowsingThreads: () => {},
      setHasMoreBrowsing: () => {},
      setBrowsingLimit: () => {},
      setBrowsingQuery: () => {},
      pushPath: () => {},
      blacklistUser: () => {},
      whitelistUser: () => {},
      blacklistAll: () => {},
      whitelistAll: () => {},
      openSnackbar: () => {},
      closeSnackbar: () => {}
    },
    closeSideNav: () => {},
    windowSize: 'large',
    params: {},
    categories: [{_id: '123', name: 'General'}]
  };
  describe('when user sign in', () => {
    var component;
    beforeEach(() => {
      foo.routes = [{}, {}, {}, {}];
      jasmineReact.spyOnClass(Main, 'viewThread');
      jasmineReact.spyOnClass(Main, 'setUser');
      const currentUser = {
        _id: 1,
        username: 'Tom'
      };
      component = TestUtils.renderIntoDocument(
        <Main currentUser={currentUser} {...foo}/>
      );
    });

    afterEach(() => {
      delete ReactiveDict._dictsToMigrate.browsing;
    });

    it('render main section', () => {
      const section = TestUtils.findRenderedDOMComponentWithTag(component, 'section');
      expect(section).toBeDefined();
    });

    it('render FeaturedUsers inside section', () => {
      const right = TestUtils.findRenderedComponentWithType(component, FeaturedUsers);
      expect(right).toBeDefined();
    });

    it('trigger viewThreads function on callback from LeftWrapper', () => {
      const left = TestUtils.findRenderedComponentWithType(component, LeftWrapper);
      left.props.viewThread();
      expect(jasmineReact.classPrototype(Main).viewThread).toHaveBeenCalled();
    });

    it('trigger setUser on callback from FeaturedUsers', () => {
      const right = TestUtils.findRenderedComponentWithType(component, FeaturedUsers);
      right.props.onUser();
      expect(jasmineReact.classPrototype(Main).setUser).toHaveBeenCalled();
    });

  });

  describe('when user view particular thread', () => {
    var component;
    foo.params = {thread: 1};
    beforeEach(() => {
      foo.routes = [{}, {}, {}, {path: 'thread/1'}];
      spyOn(Threads, 'findOne').and.returnValue({_id: 1, title: 'None', user: {_id: 1, username: 'yo'}, comments: []});
      component = TestUtils.renderIntoDocument(
        <Main {...foo}/>
      );
    });

    afterEach(() => {
      delete ReactiveDict._dictsToMigrate.browsing;
    });

    it('render ThreadUsers inside section', () => {
      const right = TestUtils.findRenderedComponentWithType(component, ThreadUsers);
      expect(right).toBeDefined();
    });
  });
})
