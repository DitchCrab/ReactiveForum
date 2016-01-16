import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import ThreadList from 'forum/client/components/left/thread_list';
import Threads from 'forum/collections/threads';
import {Card, CardMedia, CardTitle, IconButton} from 'material-ui';
import { ContentFlag } from 'material-ui/lib/svg-icons';
import moment from 'moment';

describe('Thread list', () => {
  var component;
  var foo = {
    viewThread: () => {},
    openSnackbar: () => {},
    closeSnackbar: () => {},
    flagThread: () => {},
    unflagThread: () => {}
  };
  describe('with no thread', () => {
    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <ThreadList {...foo}/>
      )
    });

    it('has zero card', () => {
      const cards = TestUtils.scryRenderedComponentsWithType(component, Card);
      expect(cards.length).toEqual(0);
    })
  });

  describe('with two threads and user not sign in', () => {
    var threads;
    beforeEach(() => {
      threads = [
        {_id: 1, imgUrl: '123', title: 'none', description: 'none'},
        {_id: 2, imgUrl: '1234', title: 'none4', description: 'none4'}        
      ];
      spyOn(foo, 'viewThread');
      component = TestUtils.renderIntoDocument(
        <ThreadList threads={threads} {...foo}/>
      )
    });

    it('has two card', () => {
      const cards = TestUtils.scryRenderedComponentsWithType(component, Card);
      expect(cards.length).toEqual(2);
    });

    it('has no flag', () => {
      const flags = TestUtils.scryRenderedComponentsWithType(component, ContentFlag);
      expect(flags.length).toEqual(0);
    });

    it('has zero like', () => {
      const likes = TestUtils.scryRenderedDOMComponentsWithClass(component, 'thread-like');
      expect(likes[0].innerText).toEqual('');
    });

    it('has zero comment', () => {
      const comments = TestUtils.scryRenderedDOMComponentsWithClass(component, 'thread-comment');
      expect(comments[0].innerText).toEqual('');
    });

    it('has the right image url', () => {
      const imgs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'img');
      expect(imgs[0].props.src).toEqual(threads[0].imgUrl);
    });

    it('has the right description', () => {
      const describes = TestUtils.scryRenderedComponentsWithType(component, CardTitle);
      expect(describes[0].props.subtitle.props.children).toEqual(threads[0].description);
      expect(describes[0].props.title).toEqual(threads[0].title);      
    });

    it('trigger callback when click on card', () => {
      const cards = TestUtils.scryRenderedComponentsWithType(component, Card);
      TestUtils.Simulate.click(ReactDOM.findDOMNode(cards[0]));
      expect(foo.viewThread.calls.count()).toEqual(1);
    })

  });

  describe('when user not sign in', () => {
    beforeEach(() => {
      const threads = [
        {user: {_id: 1, username: 'Tom'}, category: 1, title: 'None', description: 'None', tags: ['hi', 'there'], comments: [], createdAt: moment.utc().format(), updatedAt: moment.utc().format()}
      ];
      component = TestUtils.renderIntoDocument(
        <ThreadList threads={threads} {...foo}/>
      )
    });

    it('has no effect on like click', () => {
      const buttons = TestUtils.scryRenderedComponentsWithType(component, IconButton);
      TestUtils.Simulate.click(ReactDOM.findDOMNode(buttons[0]));
      const like = TestUtils.findRenderedDOMComponentWithClass(component, 'thread-like');
      expect(like.innerText).toEqual('');
    });
  });
  
  describe('when user sign in', () => {
    var threads;
    beforeEach(() => {
      spyOn(foo, 'flagThread');
      const threads = [
        {user: {_id: 1, username: 'Tom'}, category: 1, title: 'None', description: 'None', tags: ['hi', 'there'], comments: [], createdAt: moment.utc().format(), updatedAt: moment.utc().format()}
      ];
      const currentUser = {
        _id: 1,
        username: 'Tom'
      }
      component = TestUtils.renderIntoDocument(
        <ThreadList currentUser={currentUser} threads={threads} {...foo}/>
      )
    });

    it('has one flag if user sign in', () => {
      const flags = TestUtils.scryRenderedComponentsWithType(component, ContentFlag);
      expect(flags.length).toEqual(1);
    });

    it('has effect on flag click', () => {
      const buttons = TestUtils.scryRenderedComponentsWithType(component, IconButton);
      TestUtils.Simulate.click(ReactDOM.findDOMNode(buttons[2]));
      expect(foo.flagThread).toHaveBeenCalled();
    })
  })
})
