import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Components
import Reply from './reply';
import { FlatButton, TextField, Avatar, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/center/thread/comment';
const { Colors, AutoPrefix } = Styles;
// Helpers
import moment from 'moment';

/**
* Comment component
* Children of CommentList component
* Responsible for viewing comment, editing and repling to a comment
*/
export default class Comment extends Component {

  static propTypes = {
    currentUser: PropTypes.object, // User signed in object
    comment: PropTypes.object, // Single comment object
    newReplyId: PropTypes.string,     // [comment._id, reply._id] of reply just created. Used to scroll to that reply element
    newCommentId: PropTypes.string,     // Id of comment just created
    onLike: PropTypes.func, 
    onLikeReply: PropTypes.func,
    updateComment: PropTypes.func,
    updateReply: PropTypes.func,
    createReply: PropTypes.func,
    closeReply: PropTypes.func,
    openReply: PropTypes.func,
    onReplying: PropTypes.string, //To check if reply is on the right comment component
    openSnackbar: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    // Render editing field
    this.renderEditing = this.renderEditing.bind(this);
    this.renderReply = this.renderReply.bind(this);
    // Change state of comment
    this.editComment = this.editComment.bind(this);
    // Get comment text and fire callback
    this.updateComment = this.updateComment.bind(this);
    this.createReply = this.createReply.bind(this);
  }

  // Scroll to comment if receive newCommentId prop
  componentDidMount() {
    if (this.props.comment._id === this.props.newCommentId) {
      let view = ReactDOM.findDOMNode(this);
      if (view) {
        view.scrollIntoView();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);
    const same_comment = _.isEqual(this.props.comment, nextProps.comment);
    const same_editing_state = this.state.editing === nextState.editing;
    const same_reply = this.props.onReplying === nextProps.onReplying;
    if (same_user && same_comment && same_editing_state && same_reply) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    const comment = this.props.comment;
    if (!comment) {
      return <div/>;
    }
    let comment_avatar = null;
    if (!comment.avatar) {
      comment_avatar = <Avatar>{comment.username[0]}</Avatar>;
    } else {
      comment_avatar = <Avatar src={comment.avatar} />;
    };
    let replies = null;
    if (comment.replies) {
      replies = comment.replies.map((reply, index) => {
        let reply_props = {
          currentUser: this.props.currentUser,
          key: reply._id,
          ref: reply._id,
          reply: reply,
          onLikeReply: this.props.onLikeReply.bind(null, index),
          updateReply: this.props.updateReply.bind(null, index),
          openSnackbar: this.props.openSnackbar
        };
        if (this.props.newReplyId === reply._id) {
          reply_props.newReplyId = this.props.newReplyId;
        }
        return <Reply {...reply_props}/>
      })
    };
    const currentUserId = this.props.currentUser ? this.props.currentUser._id : null;
    return (
      <div>
        <div>
          <div style={ComponentStyle.avatar}>
            {comment_avatar}
          </div>
          <div style={ComponentStyle.header}>
            <p>
              <span className="comment-username" style={ComponentStyle.username}>{comment.username}</span>
            </p>
            <p style={ComponentStyle.actions}>
              <span
                  className="comment-time"
                  style={ComponentStyle.subAction}>
                {moment(comment.createdAt).fromNow()}
              </span>
              <span
                  className="comment-like"
                  style={ComponentStyle.subAction}
                  onClick={this.props.currentUser // Like if user signed in; otherwise show call to action
                           ? this.props.onLike.bind(null, comment._id)
                           : this.props.openSnackbar}>
                Like: {comment.likes}
              </span>
              <span
                  className="comment-reply"
                  style={ComponentStyle.subAction}
                  onClick={this.props.currentUser // Commend if user signed in; otherwise show call to action
                           ? this.props.openReply
                           : this.props.openSnackbar}>
                Reply
              </span>
              { comment.userId === currentUserId && !this.state.editing //Show edit if is the comment user and not editing
               ? <span className="comment-edit" onClick={this.editComment}>Edit</span>
               : null }
            </p>
          </div>
        </div>
        <div>
          <div style={ComponentStyle.commentDiv}>
            <div className="comment-text" style={AutoPrefix.all(ComponentStyle.comment)}>
              { this.state.editing // Comment edit
               ? this.renderEditing(comment.text)
                 : comment.text }
              { this.props.onReplying === this.props.comment._id //Reply to comment
               ? this.renderReply()
                 : null }
            </div>
            {replies}
          </div>
        </div>
      </div>
    )
  }

  // @params text {string} - The old comment
  renderEditing(text) {
    return (
      <div style={ComponentStyle.editingDiv}>
        <TextField
            ref="commentInput"    
            defaultValue={text}
            multiLine={true}
            autoFocus={true}
            style={ComponentStyle.commentEditField}
        />
        <p>
          <FlatButton label="Cancel" onTouchTap={() => {this.setState({editing: false})}}/>   
          <FlatButton label="Done" primary={true} onTouchTap={this.updateComment} />
        </p>
      </div>
    )
  }

  renderReply() {
    if (!this.props.currentUser) {
      return;
    }
    return (
      <div style={ComponentStyle.editingDiv}>
        <h4 style={ComponentStyle.replyHeader}>Reply to {this.props.comment.username}:</h4>
        <TextField
            ref="replyInput"    
            multiLine={true}
            autoFocus={true}
            style={ComponentStyle.commentEditField}
        />
        <p>
          <FlatButton label="Cancel" onTouchTap={this.props.closeReply}/>   
          <FlatButton label="Done" primary={true} onTouchTap={this.createReply} />
        </p>
      </div>
    )
  }

  editComment() {
    this.setState({editing: true});
  }

  updateComment(event) {
    event.preventDefault();
    let text = this.refs.commentInput.getValue();
    this.setState({editing: false});
    this.props.updateComment.bind(null, text)();
  }

  createReply(event) {
    let text = this.refs.replyInput.getValue();
    this.props.createReply.bind(null, text)();
  }
};
