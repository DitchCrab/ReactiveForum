import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import CommentList from 'forum/client/widgets/comment_list';
import Comment from 'forum/client/widgets/comment';
import { IconButton } from 'material-ui';
import { NavigationMoreHoriz } from 'material-ui/lib/svg-icons';
import moment from 'moment';

describe('Comment list widget', () => {
  var foo = {
    like: (id) => {return id;},
    commend: (id) => {return id;},
    likeReply: () => {return 1}
  };
  describe('with one comment', () => {
    var component;
    beforeEach(() => {
      jasmineReact.spyOnClass(CommentList, 'getMoreComments');
      component = TestUtils.renderIntoDocument(
        <CommentList comments={[{_id: 1, username: 'Tom', createdAt: moment.utc().format(), text: "hello"}]} notSeenUser={[]} onLike={foo.like} onCommend={foo.commend} onLikeReply={foo.likeReply} />
      );
    });

    it('has navigation horizontall button', () => {
      const button = TestUtils.findRenderedComponentWithType(component, IconButton);
      expect(button).toBeDefined();
    });

    it('has one commend', () => {
      const comments = TestUtils.scryRenderedComponentsWithType(component, Comment);
      expect(comments.length).toEqual(1);
    });

    it('call getMoreComments func', () => {
      const button = TestUtils.findRenderedDOMComponentWithClass(component, 'more-comments');

      const mark = component.state.timeMark;
      TestUtils.Simulate.click(button);
      expect(jasmineReact.classPrototype(CommentList).getMoreComments.calls.count()).toEqual(1);
      expect(component.state.timeMark).toEqual(mark);
    });
  });
  
  describe('with three comment', () => {
    var component;
    beforeEach(() => {
      let comments = [
        {_id: 1, username: 'Tom', createdAt: moment.utc().format(), text: "hello"},
        {_id: 2, username: 'Tom', createdAt: moment.utc().add(1, 'minute').format(), text: "hello"},
        {_id: 3, username: 'Tom', createdAt: moment.utc().add(2, 'minutes').format(), text: "hello"}        
      ]
      component = TestUtils.renderIntoDocument(
        <CommentList comments={comments} notSeenUser={[]} onLike={foo.like} onCommend={foo.commend} onLikeReply={foo.likeReply} />
      );
    });

    it('has two commend', () => {
      const comments = TestUtils.scryRenderedComponentsWithType(component, Comment);
      expect(comments.length).toEqual(2);
    });

    it('call getMoreComments func', () => {
      const button = TestUtils.findRenderedDOMComponentWithClass(component, 'more-comments');
      const mark = component.state.timeMark;
      TestUtils.Simulate.click(button);
      const comments = TestUtils.scryRenderedComponentsWithType(component, Comment);      
      expect(comments.length).toEqual(3);
    });
  })  
  
})
