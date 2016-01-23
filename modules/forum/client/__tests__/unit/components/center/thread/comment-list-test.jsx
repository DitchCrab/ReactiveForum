import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import CommentList from 'forum/client/components/center/thread/comment_list';
import Comment from 'forum/client/components/center/thread/comment';
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
      updateComment: () => {},
      updateReply: () => {},
      createReply: () => {},
      openReply: () => {},
      closeReply: () => {},
    };
    beforeEach(() => {
      jasmineReact.spyOnClass(CommentList, 'getMoreComments');
      const comments = [
        {_id: 1, username: 'Tom', createdAt: moment.utc().format(), text: "hello"}
      ]
      const thread = {_id: '1', comments: comments};
      component = TestUtils.renderIntoDocument(
        <CommentList comments={comments} thread={thread} {...foo} />
      );
    });

    it('does not have navigation horizontall button', () => {
      const button = TestUtils.scryRenderedComponentsWithType(component, IconButton);
      expect(button.length).toEqual(0);
    });

    it('has one commend', () => {
      const comments = TestUtils.scryRenderedComponentsWithType(component, Comment);
      expect(comments.length).toEqual(1);
    });

  });
  
  describe('with ten comments', () => {
    var component;
    var foo = {
      onLike: (id) => {return id;},
      onCommend: (id) => {return id;},
      onLikeReply: () => {},
      moveToCommentId: () => {},
      moveToReplyId: () => {},
      updateComment: () => {},
      updateReply: () => {},
      createReply: () => {},
      openReply: () => {},
      closeReply: () => {}
    };
    beforeEach(() => {
      const comments = [
        {_id: 1, username: 'Tom', createdAt: moment.utc().format(), text: "hello"},
        {_id: 2, username: 'Tom', createdAt: moment.utc().add(1, 'minute').format(), text: "hello"},
        {_id: 3, username: 'Tom', createdAt: moment.utc().add(2, 'minutes').format(), text: "hello"},        
        {_id: 4, username: 'Tom', createdAt: moment.utc().add(3, 'minutes').format(), text: "hello"},       
        {_id: 5, username: 'Tom', createdAt: moment.utc().add(4, 'minutes').format(), text: "hello"},       
        {_id: 6, username: 'Tom', createdAt: moment.utc().add(5, 'minutes').format(), text: "hello"},       
        {_id: 7, username: 'Tom', createdAt: moment.utc().add(6, 'minutes').format(), text: "hello"},       
        {_id: 8, username: 'Tom', createdAt: moment.utc().add(7, 'minutes').format(), text: "hello"},       
        {_id: 9, username: 'Tom', createdAt: moment.utc().add(8, 'minutes').format(), text: "hello"},       
        {_id: 10, username: 'Tom', createdAt: moment.utc().add(9, 'minutes').format(), text: "hello"}        
      ]
      const thread = {_id: '1', comments: comments};
      component = TestUtils.renderIntoDocument(
        <CommentList comments={comments} thread={thread} {...foo} />
      );
    });

    it('has eight commend', () => {
      const comments = TestUtils.scryRenderedComponentsWithType(component, Comment);
      expect(comments.length).toEqual(8);
    });

    it('call getMoreComments func', () => {
      const button = TestUtils.findRenderedDOMComponentWithClass(component, 'more-comments');
      TestUtils.Simulate.click(button);
      const comments = TestUtils.scryRenderedComponentsWithType(component, Comment);      
      expect(comments.length).toEqual(10);
    });
  })  
  
})
