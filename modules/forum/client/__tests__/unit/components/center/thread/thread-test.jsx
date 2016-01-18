import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import {Thread} from 'forum/client/components/center/thread/thread';
import BottomToolbar from 'forum/client/components/center/thread/bottom_toolbar';
import CommentList from 'forum/client/components/center/thread/comment_list';
import { FlatButton, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField} from 'material-ui';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';

describe('Thread', () => {
  var component;
  var foo = {
    actions: {
      getThread: () => {},
      addViewedThread: () => {},
      createComment: () => {},
      likeThread: () => {},
      likeComment: () => {},
      likeReply: () => {},
      updateComment: () => {},
      updateReply: () => {},
      createReply: () => {},
      pushPath: () => {},
      createReply: () => {},
      openReply: () => {},
      closeReply: () => {}
    },
    toggleCarousel: () => {return 1;},
    updateThreadList: () => {return 2;},
    newMessages: 0,
    threadList: [],
    windowSize: 'large',
    thread: {_id: 1, title: 'None', imgUrl: 'None', description: 'None', user: {_id: 1, username: 'Tom', avatar: null}, comments: []},
    params: {}
  };
  
  beforeEach(() => {
    delete ReactiveDict._dictsToMigrate.thread;
  });
  
  describe('when user sign in', () => {
    beforeEach(() => {
      const currentUser = {_id: 1, username: 'Tom'};
      const viewingCarousel = false;
      const notSeenUser = [1, 2];
      spyOn(Meteor, 'call').and.callFake(() => {return true;});
      spyOn(foo.actions, 'likeThread');
      spyOn(foo.actions, 'likeComment');
      spyOn(foo.actions, 'likeReply');
      component = TestUtils.renderIntoDocument(
        <Thread currentUser={currentUser} viewingCarousel={viewingCarousel} notSeenUser={notSeenUser} {...foo}/>
      );
    });

    afterEach(() => {
      delete ReactiveDict._dictsToMigrate.thread;
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
      expect(foo.actions.likeThread).toHaveBeenCalled();
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

    it('trigger likeComment on callback', () => {
      const list = TestUtils.findRenderedComponentWithType(component, CommentList);
      list.props.onLike();
      expect(foo.actions.likeComment).toHaveBeenCalled();
    });

    it('trigger likeReply on callback', () => {
      const list = TestUtils.findRenderedComponentWithType(component, CommentList);
      list.props.onLikeReply();
      expect(foo.actions.likeReply).toHaveBeenCalled();
    });

    it('has one BottomTextInput', () => {
      const comps = TestUtils.scryRenderedComponentsWithType(component, BottomToolbar);
      expect(comps.length).toEqual(1);
    });

  });

  describe('when user not sign in', () => {
    beforeEach(() => {
      const viewingCarousel = false;
      const notSeenUser = [1, 2];
      component = TestUtils.renderIntoDocument(
        <Thread viewingCarousel={viewingCarousel} notSeenUser={notSeenUser} {...foo}/>
      );
    });

    afterEach(() => {
      delete ReactiveDict._dictsToMigrate.thread;
    });

    it('does not have BottomToolbar', () => {
      const comps = TestUtils.scryRenderedComponentsWithType(component, BottomToolbar);
      expect(comps.length).toEqual(0);
    });

  })
    
})
