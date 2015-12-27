import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import LeftWrapper from 'forum/client/left/left_wrapper';
import { IconButton, ListItem, TextField } from 'material-ui';
import Threads from 'forum/collections/threads';
import Categories from 'forum/collections/categories';

describe('Left wrapper', () => {
  var foo = {
    viewThread: () => { return 1;},
    onSearch: (query) => {return query;},
    onSelectCategory: () => {return 3;},
    resetSearch: () => {return 4;},
    increaseBrowsingLimit: () => {return 5;}
  };

  describe('when user not log in', () => {
    var component;
    beforeEach(() => {
      spyOn(Categories, 'find').and.returnValue({fetch: () => {return [];}});
      jasmineReact.spyOnClass(LeftWrapper, 'clearSearch');
      jasmineReact.spyOnClass(LeftWrapper, 'searchThreadsByEnter');      
      component = TestUtils.renderIntoDocument(
        <LeftWrapper {...foo}/>
      )
    });

    it('has search field', () => {
      const search = TestUtils.findRenderedComponentWithType(component, TextField);
      expect(search).toBeDefined();
    });

    it('clear search field on blur', () => {
      const search = TestUtils.findRenderedComponentWithType(component, TextField);
      TestUtils.Simulate.blur(ReactDOM.findDOMNode(search).getElementsByTagName('input')[0], {target: {value: 'hi'}});
      expect(jasmineReact.classPrototype(LeftWrapper).clearSearch.calls.count()).toEqual(1);
      const search2 = TestUtils.findRenderedComponentWithType(component, TextField);
      expect(ReactDOM.findDOMNode(search2).getElementsByTagName('input')[0].value).toEqual('');
    });

    it('search threads by enter', () => {
      const search = TestUtils.findRenderedComponentWithType(component, TextField);
      TestUtils.Simulate.keyUp(ReactDOM.findDOMNode(search).getElementsByTagName('input')[0], {key: 'Enter', keyCode: 13, which: 13, preventDefault: () => {}, target: {value: 'hello'}});
      expect(jasmineReact.classPrototype(LeftWrapper).searchThreadsByEnter.calls.count()).toEqual(1);
      expect(jasmineReact.classPrototype(LeftWrapper).searchThreadsByEnter.calls.argsFor(0)[0].keyCode).toEqual(13);
    });

    it('has zero category', () => {
      const categories = TestUtils.scryRenderedComponentsWithType(component, ListItem);
      expect(categories.length).toEqual(0);
    });

    it('has no button to create new thread if user is not logged in', () => {
      const button = TestUtils.scryRenderedComponentsWithType(component, IconButton);
      expect(button.length).toEqual(0);
    })
  });

  describe('with categories', () => {
    var component;
    var categories;
    var cats = Categories.find();
    beforeEach(() => {
      spyOn(Meteor, 'user').and.returnValue({
        _id: 1,
        username: 'Tom'
      });
      const categories = [
        {_id: 1, name: 'Cat1'},
      ];
      jasmineReact.spyOnClass(LeftWrapper, 'selectCategory');
      component = TestUtils.renderIntoDocument(
        <LeftWrapper categories={categories} {...foo}/>
      );
    });

    it('has one category', () => {
      const categories = TestUtils.scryRenderedComponentsWithType(component, ListItem);
      expect(categories.length).toEqual(1);
    });

    it('trigger select category function', () => {
      const category = TestUtils.findRenderedComponentWithType(component, ListItem);
      category.props.onClick();
      expect(jasmineReact.classPrototype(LeftWrapper).selectCategory.calls.count()).toEqual(1);
    });
  });

  describe('when user log in', () => {
    var component;
    beforeEach(() => {
      const currentUser = {
        _id: 1,
        username: 'Tom'
      };
      jasmineReact.spyOnClass(LeftWrapper, '_openDialog');
      component = TestUtils.renderIntoDocument(
        <LeftWrapper currentUser={currentUser} {...foo}/>
      )
    });

    it('has one button to create new thread if user is logged in', () => {
      const button = TestUtils.scryRenderedComponentsWithType(component, IconButton);
      expect(button.length).toEqual(1);
    });

    it('open dialog when user click on button', () => {
      const button = TestUtils.findRenderedComponentWithType(component, IconButton);
      TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
      expect(jasmineReact.classPrototype(LeftWrapper)._openDialog.calls.count()).toEqual(1);
    });
  })
   
})
