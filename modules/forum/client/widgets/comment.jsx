import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { EditorInsertComment } from 'material-ui/lib/svg-icons';
import Reply from './reply';
import { FlatButton, TextField, Avatar, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/widgets/comment';
const { Colors, AutoPrefix } = Styles;

export default class Comment extends Component {

  static propTypes = {
    // If user signed in
    currentUser: PropTypes.object,
    comment: PropTypes.object,
    // [comment._id, reply._id] of reply just created. Used to scroll to that reply element
    newReplyId: PropTypes.string,
    // Id of comment just created
    newCommentId: PropTypes.string,
    // Callback for server methods
    onCommend: PropTypes.func,
    onLike: PropTypes.func,
    onLikeReply: PropTypes.func,
    // Callbacks on update events
    updateComment: PropTypes.func,
    updateReply: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    // Render editing field
    this.renderEditing = this.renderEditing.bind(this);
    // Change state of comment
    this.editComment = this.editComment.bind(this);
    // Get comment text and fire callback
    this.updateComment = this.updateComment.bind(this);
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
    if (same_user && same_comment && same_editing_state) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    let comment = this.props.comment;
    if (!comment) {
      return <div/>;
    }
    if (!comment.avatar) {
      var comment_avatar = <Avatar>{comment.username[0]}</Avatar>;
    } else {
      var comment_avatar = <Avatar src={comment.avatar} />;
    };
    var replies;
    if (comment.replies) {
      replies = comment.replies.map((reply, index) => {
        let reply_props = {
          currentUser: this.props.currentUser,
          key: reply._id,
          ref: reply._id,
          reply: reply,
          onLikeReply: this.props.onLikeReply.bind(null, index),
          updateReply: this.props.updateReply.bind(null, index)
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
              <span className="comment-time" style={ComponentStyle.subAction}>{moment(comment.createdAt).fromNow()}</span>
              <span className="comment-reply" style={ComponentStyle.subAction}>Reply: {comment.replies ? comment.replies.length : null}</span>
              <span className="comment-like" style={ComponentStyle.subAction} onClick={this.props.onLike.bind(null, comment._id)}>Like: {comment.likes}</span>
              { comment.userId === currentUserId && !this.state.editing ? <span className="comment-edit" onClick={this.editComment}>Edit</span> : null }
            </p>
          </div>
          <div style={ComponentStyle.insertCommentDiv}>
            <EditorInsertComment className="insert-comment" color={Colors.grey500} style={ComponentStyle.insertIcon} onClick={this.props.onCommend.bind(null, comment._id)}/>
          </div>
        </div>
        <div>
          <div style={ComponentStyle.commentDiv}>
            <div className="comment-text" style={AutoPrefix.all(ComponentStyle.comment)}>
              {this.state.editing ? this.renderEditing(comment.text) : comment.text }
            </div>
            {replies}
          </div>
        </div>
      </div>
    )
  }

  renderEditing(text) {
    return (
      <div style={ComponentStyle.editingDiv}>
        <TextField
            ref="commentInput"    
            defaultValue={text}
            multiLine={true}
            style={ComponentStyle.commentEditField}
        />
        <p>
          <FlatButton label="Cancel" onTouchTap={this.updateComment}/>   
          <FlatButton label="Done" primary={true} onTouchTap={this.updateComment} />
        </p>
      </div>
    )
  }

  editComment() {
    this.setState({editing: true});
  }

  updateComment(event) {
    let text = this.refs.commentInput.getValue();
    this.props.updateComment.bind(null, text)();
    this.setState({editing: false});
  }
};
