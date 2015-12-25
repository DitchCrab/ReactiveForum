import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import Thread from 'forum/client/thread/thread';
import BottomToolbar from 'forum/client/thread/bottom_toolbar';
import CommentList from 'forum/client/widgets/comment_list';
import { FlatButton, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField} from 'material-ui';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';

describe('Thread', () => {
  var component;
  var foo = {
    toggle: () => {}
  }

  describe('when user sign in', () => {
    beforeEach(() => {
      const thread = {_id: 1, title: 'None', imgUrl: 'None', description: 'None', user: {_id: 1, username: 'Tom'}};
      const currentUser = {_id: 1, username: 'Tom'};
      const viewingCarousel = false;
      const notSeenUser = [1, 2];
      jasmineReact.spyOnClass(Thread, 'likeReply');
      jasmineReact.spyOnClass(Thread, 'likeComment');
      jasmineReact.spyOnClass(Thread, 'likeThread');
      jasmineReact.spyOnClass(Thread, 'closeReplyDialog');
      jasmineReact.spyOnClass(Thread, 'openReplyDialog');
      jasmineReact.spyOnClass(Thread, 'addReply');
      jasmineReact.spyOnClass(Thread, 'cancelReply');
      component = TestUtils.renderIntoDocument(
        <Thread thread={thread} currentUser={currentUser} toggleCarousel={foo.toggle} viewingCarousel={viewingCarousel} notSeenUser={notSeenUser} />
      );
    });

    it('has main card of thread', () => {
      const card = TestUtils.findRenderedComponentWithType(component, Card);
      expect(card).toBeDefined();
    });

    it('has username of owner of thread in header', () => {
      const username = TestUtils.findRenderedDOMComponentWithClass(component, 'thread-main-user');
      expect(username.innerText).toEqual('Tom');
    });

    it('has avatar of owner of thread in header', () => {
      const header = TestUtils.findRenderedComponentWithType(component, CardHeader);
      expect(header.props.avatar).toBeDefined();
    });

    it('trigger likeThread function when user click on star button', () => {
      const like = TestUtils.scryRenderedComponentsWithType(component, IconButton)[0];
      like.props.onClick();
      expect(jasmineReact.classPrototype(Thread).likeThread).toHaveBeenCalled();
    });

    it('has star icon', () => {
      const like = TestUtils.findRenderedComponentWithType(component, ToggleStar);
      expect(like).toBeDefined();
    });

    it('has CommunicationComment icon', () => {
      const icon = TestUtils.findRenderedComponentWithType(component, CommunicationComment);
      expect(icon).toBeDefined();
    });

    it('has SocialShare icon', () => {
      const icon = TestUtils.findRenderedComponentWithType(component, SocialShare);
      expect(icon).toBeDefined();
    });

    it('has thread description', () => {
      const des = TestUtils.findRenderedDOMComponentWithClass(component, 'thread-main-description');
      expect(des.innerText).toEqual('None');
    });

    it('has CommentList', () => {
      const list = TestUtils.findRenderedComponentWithType(component, CommentList);
      expect(list).toBeDefined();
    });

    it('trigger openReplyDialog on callback', () => {
      const list = TestUtils.findRenderedComponentWithType(component, CommentList);
      list.props.onCommend();
      expect(jasmineReact.classPrototype(Thread).openReplyDialog).toHaveBeenCalled();
    });

    it('trigger likeComment on callback', () => {
      const list = TestUtils.findRenderedComponentWithType(component, CommentList);
      list.props.onLike();
      expect(jasmineReact.classPrototype(Thread).likeComment).toHaveBeenCalled();
    });

    it('trigger likeReply on callback', () => {
      const list = TestUtils.findRenderedComponentWithType(component, CommentList);
      list.props.onLikeReply();
      expect(jasmineReact.classPrototype(Thread).likeReply).toHaveBeenCalled();
    });

    it('trigger closeReplyDialog on callback', () => {
      const dialog = TestUtils.findRenderedComponentWithType(component, Dialog);
      dialog.props.onRequestClose();
      expect(jasmineReact.classPrototype(Thread).closeReplyDialog).toHaveBeenCalled();
    });

    it('has one BottomTextInput', () => {
      const comps = TestUtils.scryRenderedComponentsWithType(component, BottomToolbar);
      expect(comps.length).toEqual(1);
    });

    it('has two flatbuttons in dialog', () => {
      component.setState({showCommentDialog: true});
      const buttons = TestUtils.scryRenderedComponentsWithType(component, FlatButton);
      expect(buttons.length).toEqual(2);
    });
    
    it('trigger addReply func on click on submit button in dialog', () => {
      component.setState({showCommentDialog: true});
      const button = TestUtils.scryRenderedComponentsWithType(component, FlatButton)[0];
      expect(button.props.label).toEqual('Submit');
      button.props.onTouchTap();
      expect(jasmineReact.classPrototype(Thread).addReply).toHaveBeenCalled();
    });

    it('trigger cancelReply func on click on cancel button in dialog', () => {
      component.setState({showCommentDialog: true});
      const button = TestUtils.scryRenderedComponentsWithType(component, FlatButton)[1];
      expect(button.props.label).toEqual('Cancel');
      button.props.onTouchTap();
      expect(jasmineReact.classPrototype(Thread).cancelReply).toHaveBeenCalled();
    });

    it('has dialog with title of Comment', () => {
      component.setState({showCommentDialog: true});
      const dialog = TestUtils.findRenderedComponentWithType(component, Dialog);
      expect(dialog.props.title).toEqual('Reply');
    })
    
  });

  describe('when user not sign in', () => {
    beforeEach(() => {
      const thread = {_id: 1, title: 'None', imgUrl: 'None', description: 'None', user: {_id: 1, username: 'Tom'}};
      const viewingCarousel = false;
      const notSeenUser = [1, 2];
      component = TestUtils.renderIntoDocument(
        <Thread thread={thread} currentUser={undefined} toggleCarousel={foo.toggle} viewingCarousel={viewingCarousel} notSeenUser={notSeenUser} />
      );
    });

    it('does not have BottomToolbar', () => {
      const comps = TestUtils.scryRenderedComponentsWithType(component, BottomToolbar);
      expect(comps.length).toEqual(0);
    });

    it('has on flatbutton of Cancel dialog', () => {
      component.setState({showCommentDialog: true});
      const buttons = TestUtils.scryRenderedComponentsWithType(component, FlatButton);
      expect(buttons.length).toEqual(1);
    });

    it('has dialog with title of Comment', () => {
      component.setState({showCommentDialog: true});
      const dialog = TestUtils.findRenderedComponentWithType(component, Dialog);
      expect(dialog.props.title).toEqual(null);
    })
  })
  
})
