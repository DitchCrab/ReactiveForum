import { Component, PropTypes } from 'react';
// Components
import { TextField, FlatButton, Avatar, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/center/thread/reply';
const { Colors, AutoPrefix } = Styles;
// Helpers
import moment from 'moment';

// Component for reply
export default class Reply extends Component {
  static propTypes = {
    // If user signed in
    currentUser: PropTypes.object,
    reply: PropTypes.object,
    // Callbacks for server methods
    onLikeReply: PropTypes.func,
    newReplyId: PropTypes.string,
    updateReply: PropTypes.func,
    openSnackbar: PropTypes.func
  };

  static defaultProps = {
    reply: {}
  };
  
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    // Decoupling from main render method
    this.renderEditing = this.renderEditing.bind(this);
    // Open or close editing
    this.editReply = this.editReply.bind(this);
    this.updateReply = this.updateReply.bind(this);
  }

  // If new reply is created by user, scroll to that dom element
  componentDidMount() {
    if (this.props.newReplyId === this.props.reply._id) {
      let view = ReactDOM.findDOMNode(this);
      if (view) {
        view.scrollIntoView();
      }
    }  
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);
    const same_reply = _.isEqual(this.props.reply, nextProps.reply);
    const same_editing_state = this.state.editing === nextState.editing;
    if (same_user && same_reply && same_editing_state) {
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
            <span
                className="reply-username"
                style={ComponentStyle.username}>
              {reply.username}
            </span>
          </p>
          <p style={ComponentStyle.actions}>
            <span
                className="reply-createdAt"
                style={ComponentStyle.subAction}>
              {moment(reply.createdAt).fromNow()}
            </span>
            <span
                className="reply-like"
                onClick={this.props.currentUser ? this.props.onLikeReply.bind(null) : this.props.openSnackbar}
                style={ComponentStyle.subAction}>
              Like: {reply.likes}
            </span>
            { reply.userId === currentUserId && !this.state.editing ? <span className="reply-edit" onClick={this.editReply}>Edit</span> : null }
          </p>
        </div>
        <div className="reply-text" style={AutoPrefix.all(ComponentStyle.replyDiv)}>
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
            autoFocus={true}
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
    event.preventDefault();
    let text = this.refs.replyInput.getValue();
    this.setState({editing: false});
    this.props.updateReply.bind(null, text)();
  }
  
};
