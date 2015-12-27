import { Component, PropTypes } from 'react';
import moment from 'moment';
import { TextField, FlatButton, Avatar, Styles } from 'material-ui';
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
      <div style={{paddingTop: 10, paddingBottom: 10, paddingLeft: '-10'}}>
        <div style={{display: 'inline-block', marginRight: 10, marginLeft: 5}}>
          {reply_avatar}
        </div>
        <div style={{display: 'inline-block'}}>
          <p>
            <span className="reply-username" style={{fontSize: "80%", fontWeight: 'bold', color: Colors.cyan700}}>{reply.username}</span>
          </p>
          <p style={{fontSize: "60%", color: "rgba(182, 182, 182, 1)", paddingTop: 3}}>
            <span className="reply-createdAt" style={{paddingRight: 10}}>{moment(reply.createdAt).fromNow()}</span>
            <span className="reply-like" onClick={this.props.onLikeReply.bind(null)} style={{paddingRight: 10}}>Like: {reply.likes}</span>
            { reply.userId === currentUserId && !this.state.editing ? <span className="reply-edit" onClick={this.editReply}>Edit</span> : null }
          </p>
        </div>
        <div className="reply-text" style={{fontSize: "80%", wordWrap: 'break-word', marginLeft: 55}}>
          { this.state.editing ? this.renderEditing(reply.text) : reply.text }
        </div>
      </div>
    )
  }

  renderEditing(text) {
    return (
      <div style={{width: '100%'}}>
        <TextField
            ref="replyInput"    
            defaultValue={text}
            multiLine={true}
            style={{width: '90%', fontSize: '90%'}}
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
