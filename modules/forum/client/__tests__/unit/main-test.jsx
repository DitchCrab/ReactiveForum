import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import Main from 'forum/client/main';
import Wrapper from 'forum/client/thread/wrapper';
import LeftWrapper from 'forum/client/left/left_wrapper';
import ThreadUsers from 'forum/client/right/thread_users';
import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';
import ThreadForm from 'forum/client/thread/thread_form';
import FeaturedUsers from 'forum/client/right/featured_users';
import { Dialog, FlatButton } from 'material-ui';

describe('main', () => {
  describe('when user sign in', () => {
    var component;
    const foo = {
      viewSection: () => {return 1;},
      openSideNav: () => {return 2;},
      closeSideNav: () => {return 3;},
      updateSection: () => {},
      windowSize: 'large',
      params: {}
    };
    beforeEach(() => {
      jasmineReact.spyOnClass(Main, 'selectCategory');
      jasmineReact.spyOnClass(Main, 'searchThreads');
      jasmineReact.spyOnClass(Main, 'viewThread');
      jasmineReact.spyOnClass(Main, 'setUser');
      jasmineReact.spyOnClass(Main, '_openDialog');
      jasmineReact.spyOnClass(Main, '_closeDialog');
      jasmineReact.spyOnClass(Main, '_cancelForm');
      jasmineReact.spyOnClass(Main, '_submitForm');
      spyOn(Categories, 'find').and.returnValue({fetch: () => {}});
      const currentUser = {
        _id: 1,
        username: 'Tom'
      };
      component = TestUtils.renderIntoDocument(
        <Main currentUser={currentUser} {...foo}/>
      );
    });

    it('render main section', () => {
      const section = TestUtils.findRenderedDOMComponentWithTag(component, 'section');
      expect(section).toBeDefined();
    });

    it('render wrapper inside section', () => {
      const wrapper = TestUtils.findRenderedComponentWithType(component, Wrapper);
      expect(wrapper).toBeDefined();
    });

    it('render left wrapper inside section', () => {
      const wrapper = TestUtils.findRenderedComponentWithType(component, LeftWrapper);
      expect(wrapper).toBeDefined();
    });

    it('render FeaturedUsers inside section', () => {
      const right = TestUtils.findRenderedComponentWithType(component, FeaturedUsers);
      expect(right).toBeDefined();
    });

    it('try to find category', () => {
      expect(Categories.find).toHaveBeenCalled();
    });

    it('trigger selectCategory function on callback from LeftWrapper', () => {
      const left = TestUtils.findRenderedComponentWithType(component, LeftWrapper);
      left.props.onSelectCategory();
      expect(jasmineReact.classPrototype(Main).selectCategory).toHaveBeenCalled();
    });

    it('trigger searchThreads function on callback from LeftWrapper', () => {
      const left = TestUtils.findRenderedComponentWithType(component, LeftWrapper);
      left.props.onSearch();
      expect(jasmineReact.classPrototype(Main).searchThreads).toHaveBeenCalled();
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
    const foo = {
      viewSection: () => {return 1;},
      openSideNav: () => {return 2;},
      closeSideNav: () => {return 3;},
      updateSection: () => {},
      windowSize: 'large',
      params: {thread: 1}
    };
    beforeEach(() => {
      spyOn(Threads, 'findOne').and.returnValue({_id: 1, title: 'None', user: {_id: 1, username: 'yo'}, comments: []});
      component = TestUtils.renderIntoDocument(
        <Main {...foo}/>
      );
    });

    it('render ThreadUsers inside section', () => {
      const right = TestUtils.findRenderedComponentWithType(component, ThreadUsers);
      expect(right).toBeDefined();
    });
  });

  // Dialog is render as DialogInline and not in rendered component
  describe('when user sign in with dialog open', () => {
    var component;
    const foo = {
      viewSection: () => {return 1;},
      openSideNav: () => {return 2;},
      closeSideNav: () => {return 3;},
      updateSection: () => {},
      windowSize: 'large',
      params: {}
    };
    beforeEach(() => {
      jasmineReact.spyOnClass(Main, '_openDialog');
      jasmineReact.spyOnClass(Main, '_closeDialog');
      jasmineReact.spyOnClass(Main, '_cancelForm');
      jasmineReact.spyOnClass(Main, '_submitForm');
      const currentUser = {
        _id: 1,
        username: 'Tom'
      };
      component = TestUtils.renderIntoDocument(
        <Main currentUser={currentUser} {...foo}/>
      );
    });

    it('has dialog with ThreadForm in Dialog', () => {
      const dialog = TestUtils.findRenderedComponentWithType(component, Dialog);
      expect(dialog.props.children.type).toEqual(ThreadForm);
    });

    it('trigger _cancelForm func when click on cancel button in Dialog', () => {
      const dialog = TestUtils.findRenderedComponentWithType(component, Dialog);      
      dialog.props.actions[0].props.onTouchTap();
      expect(jasmineReact.classPrototype(Main)._cancelForm).toHaveBeenCalled();
    });

    it('trigger _submitForm func when click on submit button in Dialog', () => {
      const dialog = TestUtils.findRenderedComponentWithType(component, Dialog);
      dialog.props.actions[1].props.onTouchTap();      
      expect(jasmineReact.classPrototype(Main)._submitForm).toHaveBeenCalled();
    });
    
  })
})
