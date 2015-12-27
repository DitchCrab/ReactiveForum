import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { EditorInsertComment } from 'material-ui/lib/svg-icons';
import Reply from './reply';
import { FlatButton, TextField, Avatar, Styles } from 'material-ui';
const { Colors } = Styles;

export default class Comment extends Component {

  static propTypes = {
    currentUser: PropTypes.object,
    comment: PropTypes.object,
    newReplyId: PropTypes.string,
    newCommentId: PropTypes.string,
    onCommend: PropTypes.func,
    onLike: PropTypes.func,
    onLikeReply: PropTypes.func,
    moveToReplyId: PropTypes.func,
    moveToCommentId: PropTypes.func,
    updateComment: PropTypes.func,
    updateReply: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {editing: false};
    this.renderEditing = this.renderEditing.bind(this);
    this.editComment = this.editComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  componentDidMount() {
    if (this.props.comment._id === this.props.newCommentId) {
      let view = ReactDOM.findDOMNode(this);
      if (view) {
        view.scrollIntoView();
        this.props.moveToCommentId.bind(null, null)();
      }
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
          reply_props.moveToReplyId = this.props.moveToReplyId;
        }
        return <Reply {...reply_props}/>
      })
    };
    const currentUserId = this.props.currentUser ? this.props.currentUser._id : null;
    return (
      <div>
        <div>
          <div style={{display: 'inline-block', marginRight: 10, marginLeft: 5}}>
            {comment_avatar}
          </div>
          <div style={{display: 'inline-block'}}>
            <p>
              <span className="comment-username" style={{fontSize: "80%", fontWeight: 'bold', color: Colors.cyan700}}>{comment.username}</span>
            </p>
            <p style={{fontSize: "60%", color: "rgba(182, 182, 182, 1)", paddingTop: 3}}>
              <span className="comment-time" style={{paddingRight: 10}}>{moment(comment.createdAt).fromNow()}</span>
              <span className="comment-reply" style={{paddingRight: 10}}>Reply: {comment.replies ? comment.replies.length : null}</span>
              <span className="comment-like" style={{paddingRight: 10}} onClick={this.props.onLike.bind(null, comment._id)}>Like: {comment.likes}</span>
              { comment.userId === currentUserId && !this.state.editing ? <span className="comment-edit" onClick={this.editComment}>Edit</span> : null }
            </p>
          </div>
          <div style={{display: 'inline-block', float: 'right', padding: 5}}>
            <EditorInsertComment className="insert-comment" color={Colors.grey500} style={{padding: 0, marginRight: 10}} onClick={this.props.onCommend.bind(null, comment._id)}/>
          </div>
        </div>
        <div>
          <div style={{paddingLeft: 30}}>
            <div className="comment-text" style={{fontSize: "80%", wordWrap: 'break-word', paddingLeft: 25, whiteSpace: 'pre'}}>
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
      <div style={{width: '100%'}}>
        <TextField
            ref="commentInput"    
            defaultValue={text}
            multiLine={true}
            style={{width: '90%', fontSize: '90%'}}
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
