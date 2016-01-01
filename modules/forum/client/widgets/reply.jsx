import { Component, PropTypes } from 'react';
import moment from 'moment';
import { TextField, FlatButton, Avatar, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/widgets/reply';
const { Colors } = Styles;

export default class Reply extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    reply: PropTypes.object,
    onLikeReply: PropTypes.func,
    newReplyId: PropTypes.string,
    moveToReplyId: PropTypes.func,
    updateReply: PropTypes.func
  }
  
  constructor(props) {
    super(props);
    this.state = {editing: false};
    this.renderEditing = this.renderEditing.bind(this);
    this.editReply = this.editReply.bind(this);
    this.updateReply = this.updateReply.bind(this);
  }

  componentDidMount() {
    if (this.props.newReplyId === this.props.reply._id) {
      let view = ReactDOM.findDOMNode(this);
      if (view) {
        view.scrollIntoView();
        this.props.moveToReplyId();
      }
    }  
  }

  shouldComponentUpdate(nextProps) {
    const same_user = this.props.currentUser._id === nextProps.currentUser._id;
    const same_reply = _.isEqual(this.props.reply, nextProps.reply);
    if (same_user && same_reply) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    let reply = this.props.reply;
    let currentUserId = this.props.currentUser ? this.props.currentUser._id : null;
    if (!reply) {
      return <div/>
    }
    if (!reply.avatar) {
      var reply_avatar = <Avatar>{reply.username[0]}</Avatar>;
    } else {
      var reply_avatar = <Avatar src={reply.avatar} />;
    }
    return (
      <div style={ComponentStyle.wrapper}>
        <div style={ComponentStyle.avatar}>
          {reply_avatar}
        </div>
        <div style={ComponentStyle.header}>
          <p>
            <span className="reply-username" style={ComponentStyle.username}>{reply.username}</span>
          </p>
          <p style={ComponentStyle.actions}>
            <span className="reply-createdAt" style={ComponentStyle.subAction}>{moment(reply.createdAt).fromNow()}</span>
            <span className="reply-like" onClick={this.props.onLikeReply.bind(null)} style={ComponentStyle.subAction}>Like: {reply.likes}</span>
            { reply.userId === currentUserId && !this.state.editing ? <span className="reply-edit" onClick={this.editReply}>Edit</span> : null }
          </p>
        </div>
        <div className="reply-text" style={ComponentStyle.replyDiv}>
          { this.state.editing ? this.renderEditing(reply.text) : reply.text }
        </div>
      </div>
    )
  }

  renderEditing(text) {
    return (
      <div style={ComponentStyle.editingDiv}>
        <TextField
            ref="replyInput"    
            defaultValue={text}
            multiLine={true}
            style={ComponentStyle.replyEditField}
        />
        <p>
          <FlatButton label="Cancel" onTouchTap={this.updateReply}/>   
          <FlatButton label="Done" primary={true} onTouchTap={this.updateReply} />
        </p>
      </div>
    )
  }

  editReply() {
    this.setState({editing: true});
  }

  updateReply(event) {
    let text = this.refs.replyInput.getValue();
    this.props.updateReply.bind(null, text)();
    this.setState({editing: false});
  }
  
};
