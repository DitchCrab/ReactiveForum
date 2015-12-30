import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import CommentList from 'forum/client/widgets/comment_list';
import Comment from 'forum/client/widgets/comment';
import { IconButton } from 'material-ui';
import { NavigationMoreHoriz } from 'material-ui/lib/svg-icons';
import moment from 'moment';

describe('Comment list widget', () => {
  describe('with one comment', () => {
    var component;
    var foo = {
      onLike: (id) => {return id;},
      onCommend: (id) => {return id;},
      onLikeReply: () => {},
      moveToCommentId: () => {},
      moveToReplyId: () => {},
      updateComment: () => {},
      updateReply: () => {}
    };
    beforeEach(() => {
      jasmineReact.spyOnClass(CommentList, 'getMoreComments');
      const comments = [
        {_id: 1, username: 'Tom', createdAt: moment.utc().format(), text: "hello"}
      ]
      component = TestUtils.renderIntoDocument(
        <CommentList comments={comments} {...foo} />
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
    var foo = {
      onLike: (id) => {return id;},
      onCommend: (id) => {return id;},
      onLikeReply: () => {},
      moveToCommentId: () => {},
      moveToReplyId: () => {},
      updateComment: () => {},
      updateReply: () => {}
    };
    beforeEach(() => {
      const comments = [
        {_id: 1, username: 'Tom', createdAt: moment.utc().format(), text: "hello"},
        {_id: 2, username: 'Tom', createdAt: moment.utc().add(1, 'minute').format(), text: "hello"},
        {_id: 3, username: 'Tom', createdAt: moment.utc().add(2, 'minutes').format(), text: "hello"}        
      ]
      component = TestUtils.renderIntoDocument(
        <CommentList comments={comments} {...foo} />
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
