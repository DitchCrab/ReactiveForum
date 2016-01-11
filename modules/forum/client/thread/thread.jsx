import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Threads from 'forum/collections/threads';
import BottomToolbar from './bottom_toolbar';
import CommentList from 'forum/client/widgets/comment_list';
import ThreadCarousel from './thread_carousel';
import { FlatButton, MenuItem, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField, Styles } from 'material-ui';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';
import FacebookShare from 'forum/client/icons/facebook_share';
import TwitterShare from 'forum/client/icons/twitter_share';
import RedditShare from 'forum/client/icons/reddit_share';
const { Colors } = Styles;
import ComponentStyle from 'forum/client/styles/thread/thread';
import moment from 'moment';
import * as ThreadActions from 'forum/client/actions/thread';
import * as ViewedThreadActions from 'forum/client/actions/viewed_thread';
import * as ThreadUserListActions from 'forum/client/actions/thread_user_list';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

export default class Thread extends Component {
  static propTypes = {
    windowSize: PropTypes.string,
    // Current viewing thread
    thread: PropTypes.object,
    // If user signed in
    currentUser: PropTypes.object,
    // Update when new comment or reply is created by user.
    // Used to scroll to the right element
    newCommentId: PropTypes.id,
    newReplyHash: PropTypes.object,
    blacklist: PropTypes.array,
    // List of threads which viewed
    threadList: PropTypes.array,
    // Number of new comments in a thread
    newMessages: PropTypes.number,
    updateThreadList: PropTypes.func,
  };

  componentWillMount() {
    this.threadHandler = Meteor.subscribe('viewing-threads');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.threadDict.set('id', nextProps.params.id);
    }
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

  componentWillUnmount() {
    this.threadHandler.stop();
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
    const same_messages_count = this.props.newMessages == nextProps.newMessages;
    const same_reply_hash = this.props.newReplyHash === nextProps.newReplyHash;
    if ( same_user && same_thread && same_list && same_blacklist && same_carousel && view_dialog && same_messages_count && same_reply_hash) {
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
    this.renderReplyDialog = this.renderReplyDialog.bind(this);
    this.renderCarousel = this.renderCarousel.bind(this);
    // Open or close text field for reply in dialog
    this.openReplyDialog = this.openReplyDialog.bind(this);
    this.closeReplyDialog = this.closeReplyDialog.bind(this);
    // Call server methods
    this.addReply = this.addReply.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
    // Handle Social share event
    this.share = this.share.bind(this);
    this.toggleCarousel = this.toggleCarousel.bind(this);
    this.closeCarousel = this.closeCarousel.bind(this);
    this.viewThread = this.viewThread.bind(this);
  }

  render() {
    let thread = this.props.thread;
    if (!thread) {
      return <div />;
    }
    var comment_field;
    if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
      const comment_field_props = {
        newMessages: this.props.newMessages,
        createComment: this.props.actions.createComment.bind(null, this.props.thread._id),
        toggleCarousel: this.toggleCarousel,
        viewingCarousel: this.state.viewingCarousel,
        windowSize: this.props.windowSize
      };
      comment_field = <BottomToolbar {...comment_field_props}/>;
    }
    var avatar = require('../img/avatar.png');
    if (thread.user.avatar) {
      avatar = thread.user.avatar;
    };
    return (
      <div>
        <Card style={ComponentStyle.card}>
          <CardHeader
              title={<span className="thread-main-user" style={ComponentStyle.headerTitle}>{thread.user.username}</span>}
              avatar={avatar}/>
          <CardMedia overlay={<CardTitle title={thread.title}/>}>
            <img src={thread.imgUrl} style={ComponentStyle.img}/>
          </CardMedia>
          <div style={ComponentStyle.cardContainer}>
            <IconButton touch={true}  onClick={() => this.props.actions.likeThread(this.props.thread._id)}>
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
        { this.renderReplyDialog() }
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
      onCommend: this.openReplyDialog,
      onLike: this.props.actions.likeComment.bind(null, this.props.thread._id),
      onLikeReply: this.props.actions.likeReply.bind(null, this.props.thread._id),
      updateComment: this.props.actions.updateComment.bind(null, this.props.thread._id),
      updateReply: this.props.actions.updateReply.bind(null, this.props.thread._id)
    };
    return (
      <CommentList {...comment_list_props}/>      
    )
  }

  renderReplyDialog() {
    if (this.props.currentUser) {
      var customActions = [
        <FlatButton
            key="submitReply"
            label="Submit"
            primary={true}
            onTouchTap={this.addReply} />,
        <FlatButton
            key="cancelReply"
            label="Cancel"
            secondary={true}
            onTouchTap={this.cancelReply} />
      ];
    } else {
      var customActions = [
        <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.cancelReply} />
      ]
    }
    return (
      <Dialog
          title={this.props.currentUser ? "Reply" : null }
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          actions={customActions}
          open={this.state.showReplyDialog}
          onRequestClose={this.closeReplyDialog}>
        {this.props.currentUser ? <TextField multiLine={true} ref="Reply" style={ComponentStyle.replyField}/> : <h4>Please signup to reply</h4>}
      </Dialog>
    )    
  }

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

  openReplyDialog(commentId) {
    this.setState({onComment: commentId});
    this.setState({showReplyDialog: true});
  }

  closeReplyDialog() {
    this.setState({showReplyDialog: false});
  }

  cancelReply() {
    this.setState({showReplyDialog: false});
  }

  addReply(commentId) {
    event.preventDefault();
    let text = this.refs.Reply.getValue();
    if (text && text.length > 1) {
      this.props.actions.createReply(this.props.thread._id, this.state.onComment, text);
      this.setState({showReplyDialog: false});
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
    viewedThreads: state.viewedThreads,
    newCommentId: state.newCommentId,
    newReplyHash: state.newReplyHash,
    threadUserList: state.threadUserList,
    blacklist: state.blacklist
  }
}

const actions = _.extend(ThreadActions, ViewedThreadActions, ThreadUserListActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Thread);
