import { Component, PropTypes } from 'react';
// Components
import { TextField, FlatButton, Avatar, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/center/thread/reply';
const { Colors } = Styles;
import Prefixer from 'inline-style-prefixer';
const prefixer = new Prefixer();
// Helpers
import moment from 'moment';

/**
* Reply component
* Responsible for view and edit reply
*/
export default class Reply extends Component {
  static propTypes = {
    currentUser: PropTypes.object, // user signed in object
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
    this.renderEditing = this.renderEditing.bind(this);
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
    const reply = this.props.reply;
    const currentUserId = this.props.currentUser ? this.props.currentUser._id : null;
    if (!reply) {
      return <div/>;
    }
    if (!reply.avatar) { // Reply avatar of image or first letter
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
                onClick={this.props.currentUser // Like reply if user signed in; otherwise show call to action
                         ? this.props.onLikeReply.bind(null)
                         : this.props.openSnackbar}
                style={ComponentStyle.subAction}>
              Like: {reply.likes}
            </span>
            { reply.userId === currentUserId && !this.state.editing // only show edit text if user is owner and not editing reply
             ? <span className="reply-edit" onClick={this.editReply}>Edit</span>
             : null }
          </p>
        </div>
        <div className="reply-text" style={prefixer.prefix(ComponentStyle.replyDiv)}>
          { this.state.editing // render editing text on editing event
           ? this.renderEditing(reply.text)
             : reply.text }
        </div>
      </div>
    )
  }

  // @params text {string} - old reply
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
