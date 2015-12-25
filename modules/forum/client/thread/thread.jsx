import { Component, PropTypes } from 'react';
import BottomToolbar from './bottom_toolbar';
import CommentList from 'forum/client/widgets/comment_list';
import { FlatButton, Card, CardHeader, CardMedia, CardTitle, CardActions, IconButton, CardText, Dialog, TextField, Styles } from 'material-ui';
import { ToggleStar, CommunicationComment, SocialShare } from 'material-ui/lib/svg-icons';
const { Colors } = Styles;
import moment from 'moment';

export default class Thread extends Component {
  static propTypes = {
    thread: PropTypes.object,
    currentUser: PropTypes.object,
    toggleCarousel: PropTypes.func,
    viewingCarousel: PropTypes.bool,
    notSeenUser: PropTypes.array,
    updateThreadList: PropTypes.func,
    threadList: PropTypes.array
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
  }

  render() {
    let thread = this.props.thread;
    var comment_field;
    if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
      comment_field = <BottomToolbar moveToCommentId={this.moveToCommentId} threadId={this.props.thread._id} toggleCarousel={this.props.toggleCarousel.bind(null)} viewingCarousel={this.props.viewingCarousel}/>;
    }
    var avatar = require('../img/avatar.png');
    if (thread.user.avatar) {
      avatar = thread.user.avatar;
    }
    return (
      <div>
        <Card style={{paddingBottom: 60}}>
          <CardHeader
              title={<span className="thread-main-user" style={{fontWeight: 'bold', color: Colors.cyan700}}>{thread.user.username}</span>}
              avatar={avatar}/>
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
            <CommentList moveToReplyId={this.moveToReplyId} newReplyId={this.state.newReplyId} moveToCommentId={this.moveToCommentId} newCommentId={this.state.newCommentId} comments={thread.comments} onCommend={this.openReplyDialog} onLike={this.likeComment} onLikeReply={this.likeReply} notSeenUser={this.props.notSeenUser}/>
          </CardActions>
        </Card>
        { this.renderReplyDialog() }
        { comment_field }
      </div>
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
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let width = w_w * 7 / 12;
    return (
      <Dialog
          title={this.props.currentUser ? "Reply" : null }
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          actions={customActions}
          open={this.state.showCommentDialog}
          onRequestClose={this.closeReplyDialog}>
        {this.props.currentUser ? <TextField multiLine={true} ref="Reply" style={{width: width}}/> : <h4>Please signup to reply</h4>}
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

  moveToReplyId(id) {
    this.setState({newReplyId: [this.state.onComment, id]});
  }
  
  moveToCommentId(id) {
    console.log(id);
    this.setState({newCommentId: id});
  }

};

