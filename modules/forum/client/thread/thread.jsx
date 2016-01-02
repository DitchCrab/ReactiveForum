import { Component, PropTypes } from 'react';
import BottomToolbar from './bottom_toolbar';
import CommentList from 'forum/client/widgets/comment_list';
import { FlatButton, MenuItem, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField, Styles } from 'material-ui';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';
import FacebookShare from 'forum/client/icons/facebook_share';
import TwitterShare from 'forum/client/icons/twitter_share';
import RedditShare from 'forum/client/icons/reddit_share';
const { Colors } = Styles;
import ComponentStyle from 'forum/client/styles/thread/thread';
import moment from 'moment';

export default class Thread extends Component {
  static propTypes = {
    // Current viewing thread
    thread: PropTypes.object,
    // If user signed in
    currentUser: PropTypes.object,
    // Used to open or close carousel
    viewingCarousel: PropTypes.bool,
    userBlackList: PropTypes.array,
    // List of threads which viewed
    threadList: PropTypes.array,
    // Number of new comments in a thread
    newMessages: PropTypes.number,
    // Callbacks
    toggleCarousel: PropTypes.func,
    updateThreadList: PropTypes.func,
    windowSize: PropTypes.string,
  }

  // Update threadList if current thread is not in it
  componentDidMount() {
    if (this.props.thread) {
      const found = _.find(this.props.threadList, (thread) => { return thread._id === this.props.thread});
      if (!found) {
        this.props.updateThreadList(this.props.thread);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);
    const same_thread = _.isEqual(this.props.thread, nextProps.thread);
    const same_list = _.isEqual(this.props.threadList, nextProps.threadList);
    const same_blacklist = _.isEqual(this.props.userBlackList, nextProps.userBlackList);
    const same_carousel = this.props.viewingCarousel === nextProps.viewingCarousel;
    const view_dialog = this.state.showReplyDialog === nextState.showReplyDialog;
    const same_messages_count = this.props.newMessages == nextProps.newMessages;
    if ( same_user && same_thread && same_list && same_blacklist && same_carousel && view_dialog && same_messages_count) {
      return false;
    } else {
      return true;
    }
  }
  
  // Update threadList if current thread is not in it
  componentDidUpdate(prevProps) {
    if (prevProps.thread._id !== this.props.thread._id) {
      const found = _.find(prevProps.threadList, (thread) => { return thread._id === this.props.thread});
      if (!found) {
        this.props.updateThreadList(this.props.thread);
      }
    }  
  }
  
  constructor(props, context) {
    super(props);
    this.state = {
      // Open or close reply dialog by state
      showReplyDialog: false,
      // [comment._id, reply_id] -> use to move to particular reply
      newReplyId: []
    };
    // Decoupling from main render methods
    this.renderCommentList = this.renderCommentList.bind(this);
    this.renderReplyDialog = this.renderReplyDialog.bind(this);
    // Open or close text field for reply in dialog
    this.openReplyDialog = this.openReplyDialog.bind(this);
    this.closeReplyDialog = this.closeReplyDialog.bind(this);
    // Call server methods
    this.likeReply = this.likeReply.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.likeThread = this.likeThread.bind(this);
    this.addReply = this.addReply.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateReply = this.updateReply.bind(this);
    // Fire after new comment or reply is created
    this.moveToCommentId = this.moveToCommentId.bind(this);
    this.moveToReplyId = this.moveToReplyId.bind(this);
    // Handle Social share event
    this.share = this.share.bind(this);
  }

  render() {
    let thread = this.props.thread;
    var comment_field;
    if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
      const comment_field_props = {
        newMessages: this.props.newMessages,
        moveToCommentId: this.moveToCommentId,
        threadId: this.props.thread._id,
        toggleCarousel: this.props.toggleCarousel,
        viewingCarousel: this.props.viewingCarousel,
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
            <img src={thread.imgUrl}/>
          </CardMedia>
          <div style={ComponentStyle.cardContainer}>
            <IconButton touch={true}  onClick={this.likeThread}>
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
            <span className="thread-main-description">{thread.description}</span>
          </CardText>
          <CardActions style={ComponentStyle.cardAction}>
            { this.props.thread.comments ? this.renderCommentList() : null }
          </CardActions>
        </Card>
        { this.renderReplyDialog() }
        { comment_field }
      </div>
    )
  }

  renderCommentList() {
    const comment_list_props = {
      currentUser: this.props.currentUser,
      comments: this.props.thread.comments,
      userBlackList: this.props.userBlackList,
      newReplyId: this.state.newReplyId,
      newCommentId: this.state.newCommentId,
      moveToCommentId: this.moveToCommentId,
      moveToReplyId: this.moveToReplyId,
      onCommend: this.openReplyDialog,
      onLike: this.likeComment,
      onLikeReply: this.likeReply,
      updateComment: this.updateComment,
      updateReply: this.updateReply
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

  openReplyDialog(commentId) {
    this.setState({onComment: commentId});
    this.setState({showReplyDialog: true});
  }

  closeReplyDialog() {
    this.setState({showReplyDialog: false});
  }

  likeThread() {
    Meteor.call('likeThread', this.props.thread._id, (err, result) => {
    });
  }

  likeComment(commentId) {
    Meteor.call('likeComment', this.props.thread._id, commentId, (err, result) => {
    })
  }

  likeReply(c_id, s_id) {
    Meteor.call('likeReply', this.props.thread._id, c_id, s_id, (err, result) => {
    });
  }

  cancelReply() {
    this.setState({showReplyDialog: false});
  }

  addReply(commentId) {
    event.preventDefault();
    let text = this.refs.Reply.getValue();
    if (text && text.length > 1) {
      Meteor.call('createReply', this.props.thread._id, this.state.onComment, text, (err, res) => {
        if (!err) {
          this.setState({showReplyDialog: false});
          this.moveToReplyId(res);
        }
      });
    }
  }

  updateComment(commentId, text) {
    Meteor.call('updateComment', this.props.thread._id, commentId, text, (err, res) => {
    });
  }

  updateReply(commentId, replyIndex, text) {
    Meteor.call('updateReply', this.props.thread._id, commentId, replyIndex, text, (err, res) => {
      
    });
  }

  moveToReplyId(id) {
    this.setState({newReplyId: [this.state.onComment, id]});
  }
  
  moveToCommentId(id) {
    this.setState({newCommentId: id});
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
};

