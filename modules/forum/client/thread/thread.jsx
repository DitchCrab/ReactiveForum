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
    thread: PropTypes.object,
    currentUser: PropTypes.object,
    toggleCarousel: PropTypes.func,
    viewingCarousel: PropTypes.bool,
    notSeenUser: PropTypes.array,
    updateThreadList: PropTypes.func,
    threadList: PropTypes.array,
    newMessages: PropTypes.number,
    windowSize: PropTypes.string
  }

  componentDidMount() {
    if (this.props.thread) {
      const found = _.find(this.props.threadList, (thread) => { return thread._id === this.props.thread});
      if (!found) {
        this.props.updateThreadList(this.props.thread);
      }
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.thread._id !== this.props.thread._id) {
      const found = _.find(nextProps.threadList, (thread) => { return thread._id === nextProps.thread});
      if (!found) {
        this.props.updateThreadList(nextProps.thread);
      }
    }  
  }
  
  constructor(props, context) {
    super(props);
    this.state = {showCommentDialog: false, newReplyId: []};
    this.renderCommentList = this.renderCommentList.bind(this);
    this.renderReplyDialog = this.renderReplyDialog.bind(this);
    this.openReplyDialog = this.openReplyDialog.bind(this);
    this.closeReplyDialog = this.closeReplyDialog.bind(this);
    this.likeReply = this.likeReply.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.likeThread = this.likeThread.bind(this);
    this.addReply = this.addReply.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
    this.moveToCommentId = this.moveToCommentId.bind(this);
    this.moveToReplyId = this.moveToReplyId.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateReply = this.updateReply.bind(this);
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
        toggleCarousel: this.props.toggleCarousel.bind(null),
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
            <IconMenu iconButtonElement={<SocialShare color={Colors.grey700} />}>
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
            {this.renderCommentList()}
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
      moveToReplyId: this.moveToReplyId,
      newReplyId: this.state.newReplyId,
      moveToCommentId: this.moveToCommentId,
      newCommentId: this.state.newCommentId,
      comments: this.props.thread.comments,
      onCommend: this.openReplyDialog,
      onLike: this.likeComment,
      onLikeReply: this.likeReply,
      notSeenUser: this.props.notSeenUser,
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
          open={this.state.showCommentDialog}
          onRequestClose={this.closeReplyDialog}>
        {this.props.currentUser ? <TextField multiLine={true} ref="Reply" style={ComponentStyle.replyField}/> : <h4>Please signup to reply</h4>}
      </Dialog>
    )    
  }

  openReplyDialog(commentId) {
    this.setState({onComment: commentId});
    this.setState({showCommentDialog: true});
  }

  closeReplyDialog() {
    this.setState({showCommentDialog: false});
  }

  likeThread() {
    Meteor.call('likeThread', this.props.thread._id, (err, result) => {
      console.log(err);
      console.log(result);
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
    this.setState({showCommentDialog: false});
  }

  addReply(commentId) {
    event.preventDefault();
    let text = this.refs.Reply.getValue();
    if (text && text.length > 1) {
      Meteor.call('createReply', this.props.thread._id, this.state.onComment, text, (err, res) => {
        if (!err) {
          this.setState({showCommentDialog: false});
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
    console.log(commentId);
    console.log(replyIndex);
    console.log(text);
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

