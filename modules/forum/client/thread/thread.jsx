import { Component, PropTypes } from 'react';
import BottomToolbar from './bottom_toolbar';
import CommentList from 'forum/client/widgets/comment_list';
import { FlatButton, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField, Styles } from 'material-ui';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';
const { Colors } = Styles;
import moment from 'moment';

export default class Thread extends Component {
  constructor(props, context) {
    super(props);
    this.state = {showCommentDialog: false};
    this.openReplyDialog = this.openReplyDialog.bind(this);
    this.closeReplyDialog = this.closeReplyDialog.bind(this);
    this.likeReply = this.likeReply.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.likeThread = this.likeThread.bind(this);
    this.addReply = this.addReply.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
  }

  render() {
    let thread = this.props.thread;
    var comment_field;
    if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
      comment_field = <BottomToolbar threadId={this.props.thread._id} toggleCarousel={this.props.toggleCarousel.bind(null)} viewingCarousel={this.props.viewingCarousel}/>;
    }
    if (this.props.currentUser) {
      var customActions = [
        <FlatButton
            label="Submit"
            primary={true}
            onTouchTap={this.addReply} />,
        <FlatButton
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
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let width = w_w * 7 / 12;
    return (
      <div>
        <Card style={{paddingBottom: 60}}>
          <CardHeader
              title={<span className="thread-main-user" style={{fontWeight: 'bold', color: Colors.cyan700}}>{thread.user.username}</span>}
              avatar={thread.user.avatar ? thread.user.avatar : 'avatar.png'}/>
          <CardMedia overlay={<CardTitle title={thread.title}/>}>
            <img src={thread.imgUrl}/>
          </CardMedia>
          <div style={{textAlign: 'right', margin: 0, padding: 0}}>
            <IconButton touch={true}  onClick={this.likeThread}>
              <ToggleStar color={Colors.grey700}/>
            </IconButton>
            <div style={{display: 'inline-block',fontSize: '60%'}}>{thread.likes}</div>                
            <IconButton touch={true}>
              <CommunicationComment color={Colors.grey700}/>
            </IconButton>
            <div style={{display: 'inline-block',fontSize: '60%'}}>{thread.comments ? thread.comments.length : null}</div>
            <IconButton touch={true}>
              <SocialShare color={Colors.grey700}/>
            </IconButton>
          </div>
          <CardText>
            <span className="thread-main-description">{thread.description}</span>
          </CardText>
          <CardActions style={{margin: 0, padding: 0}}>
            <CommentList comments={thread.comments} onCommend={this.openReplyDialog} onLike={this.likeComment} onLikeReply={this.likeReply} notSeenUser={this.props.notSeenUser}/>
          </CardActions>
        </Card>
        <Dialog
            title={this.props.currentUser ? "Reply" : null }
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            actions={customActions}
            open={this.state.showCommentDialog}
            onRequestClose={this.closeReplyDialog}>
          {this.props.currentUser ? <TextField multiLine={true} ref="subComment" style={{width: width}}/> : <h4>Please signup to reply</h4>}
        </Dialog>
        { comment_field }
      </div>
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
      console.log(err);
      console.log(result);
    })
  }

  likeReply(c_id, s_id) {
    Meteor.call('likeReply', this.props.thread._id, c_id, s_id, (err, result) => {
      console.log(err);
      console.log(result);
    });
  }

  cancelReply() {
    this.setState({showCommentDialog: false});
  }

  addReply(commentId) {
    event.preventDefault();
    let comment = this.refs.subComment.getValue();
    let user = Meteor.user();
    var avatar;
    if (user.profile) {
      avatar = user.profile.avatar;
    }
    var params = {_id: uuid.v1(), userId: user._id, username: user.username, avatar: avatar, comment: comment, createdAt: moment.utc().format(), like: 0};
    if (comment && comment.length > 1) {
      Meteor.call('createSubcomment', this.props.thread._id, this.state.onComment, params, (err, result) => {
        this.setState({showCommentDialog: false});
        Session.set("moveToCommentId", params._id);
      });
    }
  }

};

Thread.propTypes = {
  thread: PropTypes.object,
  currentUser: PropTypes.object,
  toggleCarousel: PropTypes.func,
  viewingCarousel: PropTypes.bool,
  notSeenUser: PropTypes.arrayOf[PropTypes.string]
}
