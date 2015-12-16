import TestUtils from 'react-addons-test-utils';
import Comment from 'forum/client/widgets/comment';
import { Avatar } from 'material-ui';
import { EditorInsertComment } from 'material-ui/lib/svg-icons';
import Reply from 'forum/client/widgets/reply';

describe('Comment widget', () => {
  var foo = {
    like: (id) => { return id},
    commend: (id) => { return id},
    likeReply: () => {return 3}
  };
  describe('with no reply', () => {
    var component;
    beforeEach(() => {
      spyOn(foo, 'commend');
      spyOn(foo, 'like');
      component = TestUtils.renderIntoDocument(
        <Comment comment={{_id: 1, username: 'Tom', createdAt: new Date(), text: "Hello"}} onCommend={foo.commend} onLike={foo.like}/>
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
      expect(reply.innerText).toEqual('Reply: ');
    });

    it('calback onLike function', () => {
      const like = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-like');
      TestUtils.Simulate.click(like);
      expect(foo.like.calls.count()).toEqual(1);
      expect(foo.like.calls.argsFor(0)[0]).toEqual(1);
    });

    it('callback onCommend function', () => {
      const insert_comment = TestUtils.findRenderedDOMComponentWithClass(component, 'insert-comment');
      TestUtils.Simulate.click(insert_comment);
      expect(foo.commend.calls.count()).toEqual(1);
      expect(foo.commend.calls.argsFor(0)[0]).toEqual(1);
    })
  });

  describe('with replies', () => {
    var component;
    beforeEach(() => {
      spyOn(foo, 'commend');
      spyOn(foo, 'like');
      spyOn(foo, 'likeReply');
      component = TestUtils.renderIntoDocument(
        <Comment comment={{username: 'Tom', createdAt: new Date(), text: 'Hi', likes: 1, replies: [{_id: 1, username: 'Zoe'}]}} onCommend={foo.commend} onLike={foo.like} onLikeReply={foo.likeReply}/>
      )
    });

    it('has 1 like', () => {
      const like = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-like');
      expect(like.innerText).toEqual('Like: 1');
    });

    it('has one reply', () => {
      const reply = TestUtils.findRenderedDOMComponentWithClass(component, 'comment-reply');
      expect(reply.innerText).toEqual('Reply: 1');
    });

    it('has 1 reply', () => {
      const replies = TestUtils.scryRenderedComponentsWithType(component, Reply);
      expect(replies.length).toEqual(1);
    });
  })
})
