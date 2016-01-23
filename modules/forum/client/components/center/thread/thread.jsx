import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// Components
import Helmet from 'react-helmet';
import BottomToolbar from './bottom_toolbar';
import CommentList from './comment_list';
import ThreadCarousel from './thread_carousel';
import { FlatButton, MenuItem, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField, Styles } from 'material-ui';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';
import {
  FacebookShare,
  TwitterShare,
  RedditShare
} from 'forum/client/icons';
const { Colors } = Styles;
import ComponentStyle from 'forum/client/styles/center/thread/thread';
// Collections
import Threads from 'forum/collections/threads';
// Redux actions
import {
  ThreadActions,
  ViewedThreadActions,
  ThreadUserListActions,
  SnackbarActions
} from 'forum/client/actions';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';
// Helpers
import moment from 'moment';
import Meta from 'forum/client/meta';

// Thread wrapper for '/forum/thread/:id' path
// Display thread, comments, replies, comment field
// Also display carousel to navigate to previous viewed threads
export class Thread extends Component {
  static propTypes = {
    windowSize: PropTypes.string,
    // Current viewing thread
    thread: PropTypes.object,
    // If user signed in
    currentUser: PropTypes.object,
    // Update when new comment or reply is created by user.
    // Used to scroll to the right element
    newCommentId: PropTypes.string,
    newReplyHash: PropTypes.object,
    // Choose to view or hide user in comment section
    blacklist: PropTypes.array,
    // List of threads that were viewed
    // Use for thread_carousel
    viewedThreads: PropTypes.arrayOf(PropTypes.object),
    // Use to locate comment id to display reply textfield
    onReplying: PropTypes.string,
  };

  componentWillReceiveProps(nextProps) {
    // Check and switch thread id when user view another thread
    if (this.props.params.id !== nextProps.params.id) {
      this.threadDict.set('id', nextProps.params.id);
    }
    // Check if the viewed thread has new message and display
    if (this.props.thread) {
      if (this.props.thread._id !== nextProps.thread._id) {
        const found = _.find(this.props.viewedThreads, thread => thread._id === nextProps.thread._id);
        if (found) {
          const count = nextProps.thread.comments.length - found.comments.length;
          this.setState({newMessages: count});
          setTimeout(() => {this.setState({newMessages: 0})}, 5000);
        }
      }
    }
  }

  componentWillMount() {
    let thread = Threads.findOne({_id: this.props.params.id});
    this.props.actions.getThread(thread);
  }

  // Update threadList if current thread is not in it
  componentDidMount() {
    this.threadDict = new ReactiveDict('thread');
    this.threadDict.set('id', this.props.params.id);
    this.tracker = Tracker.autorun(() => {
      let thread = Threads.findOne({_id: this.threadDict.get('id')});
      if (typeof thread !== 'undefined') {
        this.props.actions.getThread(thread);
        const thread_users = _.uniq(_.map(thread.comments, comment => comment.userId));
        this.props.actions.getThreadUserList(thread_users);
        const found = _.find(this.props.viewedThreads, (t) => { return t._id === thread._id});
        if (!found) {
          this.props.actions.addViewedThread(thread);
        }
      }
    })
  };

  // Remove tracker from memory when user move to other path
  componentWillUnmount() {
    this.tracker.stop();
    delete ReactiveDict._dictsToMigrate.thread;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);
    const same_thread = _.isEqual(this.props.thread, nextProps.thread);
    const same_list = _.isEqual(this.props.threadList, nextProps.threadList);
    const same_blacklist = _.isEqual(this.props.blacklist, nextProps.blacklist);
    const same_carousel = this.state.viewingCarousel === nextState.viewingCarousel;
    const view_dialog = this.state.showReplyDialog === nextState.showReplyDialog;
    const same_messages_count = this.state.newMessages == nextState.newMessages;
    const same_reply_hash = this.props.newReplyHash === nextProps.newReplyHash;
    const same_reply = this.props.onReplying === nextProps.onReplying;
    if ( same_user && same_thread && same_list && same_blacklist && same_carousel && view_dialog && same_messages_count && same_reply_hash && same_reply) {
      return false;
    } else {
      return true;
    }
  }
  
  constructor(props, context) {
    super(props);
    this.state = {
      // Open or close reply dialog by state
      showReplyDialog: false,
      viewingCarousel: false
    };
    // Decoupling from main render methods
    this.renderCommentList = this.renderCommentList.bind(this);
    this.renderCarousel = this.renderCarousel.bind(this);
    // Handle Social share event
    this.share = this.share.bind(this);
    this.toggleCarousel = this.toggleCarousel.bind(this);
    this.closeCarousel = this.closeCarousel.bind(this);
    this.viewThread = this.viewThread.bind(this);
    this.likeThread = this.likeThread.bind(this);
  }

  render() {
    let thread = this.props.thread;
    if (!thread) {
      return <div />;
    }
    var comment_field;
    if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
      const comment_field_props = {
        newMessages: this.state.newMessages,
        createComment: this.props.actions.createComment.bind(null, this.props.thread._id),
        toggleCarousel: this.toggleCarousel,
        viewingCarousel: this.state.viewingCarousel,
        windowSize: this.props.windowSize
      };
      comment_field = <BottomToolbar {...comment_field_props}/>;
    }
    var avatar = require('forum/client/img/avatar.png');
    if (thread.user.avatar) {
      avatar = thread.user.avatar;
    };
    //Meta tags
    const description = `Forum - ${thread.title}`;
    const img = thread.imgUrl;
    const path = `/forum/thread/${thread._id}`;
    const meta = Meta(path, description, img);
    return (
      <div>
        <Helmet
            title={description}
            meta={meta}
        />
        <Card style={ComponentStyle.card}>
          <CardHeader
              title={<span className="thread-main-user" style={ComponentStyle.headerTitle}>{thread.user.username}</span>}
              avatar={avatar}/>
          <CardMedia overlay={<CardTitle title={thread.title}/>}>
            <img src={thread.imgUrl} style={ComponentStyle.img}/>
          </CardMedia>
          <div style={ComponentStyle.cardContainer}>
            <IconButton touch={true}  onClick={this.likeThread.bind(null, this.props.thread._id)}>
              <ToggleStar color={Colors.grey700}/>
            </IconButton>
            <div style={ComponentStyle.subNote}>{thread.likes}</div>                
            <IconButton touch={true}>
              <CommunicationComment color={Colors.grey700}/>
            </IconButton>
            <div style={ComponentStyle.subNote}>{thread.comments ? thread.comments.length : null}</div>
            <IconMenu style={ComponentStyle.share} iconButtonElement={<SocialShare color={Colors.grey700} />}>
              <div style={ComponentStyle.socialShare}>
                <IconButton onTouchTap={this.share.bind(null, 'facebook')}>
                  <FacebookShare color={Colors.indigo500}/>
                </IconButton>
              </div>
              <div style={ComponentStyle.socialShare}>
                <IconButton onTouchTap={this.share.bind(null, 'twitter')}>
                  <TwitterShare color={Colors.blue500}/>
                </IconButton>
              </div>
              <div style={ComponentStyle.socialShare}>
                <IconButton onTouchTap={this.share.bind(null, 'reddit')}>
                  <RedditShare color={Colors.orange700}/>
                </IconButton>
              </div>
            </IconMenu>
          </div>
          <CardText>
            <span style={ComponentStyle.description} className="thread-main-description">{thread.description}</span>
          </CardText>
          <CardActions style={ComponentStyle.cardAction}>
            { this.props.thread.comments ? this.renderCommentList() : null }
          </CardActions>
        </Card>
        { this.state.viewingCarousel ? this.renderCarousel() : null }
        { comment_field }
      </div>
    )
  }

  renderCommentList() {
    const comment_list_props = {
      currentUser: this.props.currentUser,
      comments: this.props.thread.comments,
      blacklist: this.props.blacklist,
      newReplyHash: this.props.newReplyHash,
      newCommentId: this.props.newCommentId,
      moveToCommentId: this.moveToCommentId,
      onLike: this.props.actions.likeComment.bind(null, this.props.thread._id),
      onLikeReply: this.props.actions.likeReply.bind(null, this.props.thread._id),
      updateComment: this.props.actions.updateComment.bind(null, this.props.thread._id),
      updateReply: this.props.actions.updateReply.bind(null, this.props.thread._id),
      createReply: this.props.actions.createReply.bind(null, this.props.thread._id),
      onReplying: this.props.onReplying,
      closeReply: this.props.actions.closeReply,
      openReply: this.props.actions.openReply,
      openSnackbar: this.props.actions.openSnackbar,
      thread: this.props.thread,
    };
    return (
      <CommentList {...comment_list_props}/>      
    )
  }

  // Render viewed threads for navigation
  renderCarousel() {
    const thread_carousel_props = {
      onClickOutside: this.closeCarousel,
      threadList: this.props.viewedThreads,
      viewThread: this.viewThread,
      windowSize: this.props.windowSize
    };
    return (
        <ThreadCarousel {...thread_carousel_props}/>
    );
  }

  likeThread(id) {
    if (this.props.currentUser) {
      this.props.actions.likeThread(id);
    } else {
      this.props.actions.openSnackbar();
    }
  }

  share(vendor) {
    const my_url = window.location.href;
    var url;
    switch (vendor) {
      case 'facebook':
        url = `http://www.facebook.com/sharer/sharer.php?u=${my_url}&title=${this.props.thread.title}`;
        window.open(url, '_blank');
        break;
      case 'twitter':
        url = `http://twitter.com/intent/tweet?status=${this.props.thread.title}+${my_url}`;
        window.open(url, '_blank');
        break;
      case 'reddit':
        url = `http://www.reddit.com/submit?url=${my_url}&title=${this.props.thread.title}`;
        window.open(url, '_blank');
        break;
    }
  }

  toggleCarousel() {
    this.setState({viewingCarousel: !this.state.viewingCarousel});
  }

  closeCarousel() {
    this.setState({viewingCarousel: false});
  }

  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`)
  }
  
};

function mapStateToProps(state) {
  return {
    windowSize: state.windowSize,
    currentUser: state.session,
    thread: state.thread,
    onReplying: state.onReplying,
    viewedThreads: state.viewedThreads,
    newCommentId: state.newCommentId,
    newReplyHash: state.newReplyHash,
    blacklist: state.blacklist
  }
}

const actions = _.extend(ThreadActions, ViewedThreadActions, ThreadUserListActions, SnackbarActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Thread);
