import TestUtils from 'react-addons-test-utils';
import Comment from 'forum/client/components/center/thread/comment';
import { Avatar } from 'material-ui';
import { EditorInsertComment } from 'material-ui/lib/svg-icons';
import Reply from 'forum/client/components/center/thread/reply';

describe('Comment widget', () => {
  var foo = {
    onLike: (id) => { return id},
    onLikeReply: () => {},
    moveToCommentId: () => {},
    moveToReplyId: () => {},
    updateComment: () => {},
    updateReply: () => {},
    createReply: () => {},
    openReply: () => {},
    closeReply: () => {}
  };
  describe('with no reply', () => {
    var component;
    beforeEach(() => {
      spyOn(foo, 'openReply');
      spyOn(foo, 'onLike');
      component = TestUtils.renderIntoDocument(
        <Comment comment={{_id: 1, userId: 1, username: 'Tom', createdAt: new Date(), text: "Hello"}} {...foo}/>
      )
    });

    it('display avatar of user', () => {
      const avatar = TestUtils.scryRenderedComponentsWithType(component, Avatar);
      expect(avatar.length).toEqual(1);
    });

    it('has the same text', () => {
      const text = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-text');
      expect(text.innerText).toEqual("Hello");
    });

    it('has the same username', () => {
      const username = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-username');
      expect(username.innerText).toEqual("Tom");
    });

    it('has zero like', () => {
      const like = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-like');
      expect(like.innerText).toEqual('Like: ');
    });

    it('has zero reply', () => {
      const reply = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-reply');
      expect(reply.innerText).toEqual('Reply');
    });

    it('calback onLike function', () => {
      const like = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-like');
      TestUtils.Simulate.click(like);
      expect(foo.onLike.calls.count()).toEqual(1);
      expect(foo.onLike.calls.argsFor(0)[0]).toEqual(1);
    });

    it('callback openReply function', () => {
      const reply = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-reply');
      TestUtils.Simulate.click(reply);
      expect(foo.openReply.calls.count()).toEqual(1);
    })
  });

  describe('with replies', () => {
    var component;
    beforeEach(() => {
      spyOn(foo, 'openReply');
      spyOn(foo, 'onLike');
      spyOn(foo, 'onLikeReply');
      component = TestUtils.renderIntoDocument(
        <Comment comment={{user_id: 1, username: 'Tom', createdAt: new Date(), text: 'Hi', likes: 1, replies: [{_id: 1, userId: 1, username: 'Zoe', text: 'hi'}]}} {...foo}/>
      )
    });

    it('has 1 like', () => {
      const like = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-like');
      expect(like.innerText).toEqual('Like: 1');
    });

    it('has 1 reply', () => {
      const replies = TestUtils.scryRenderedComponentsWithType(component, Reply);
      expect(replies.length).toEqual(1);
    });
  })
})
