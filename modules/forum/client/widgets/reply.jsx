import { Component, PropTypes } from 'react';
import moment from 'moment';
import { Avatar, Styles } from 'material-ui';
const { Colors } = Styles;

export default class Reply extends Component {
  static propTypes = {
    reply: PropTypes.object,
    onLikeReply: PropTypes.func,
    newReplyId: PropTypes.string,
    moveToReplyId: PropTypes.func
  }
  
  constructor(props) {
    super(props);
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
            <span className="reply-like" onClick={this.props.onLikeReply.bind(null)}>Like: {reply.likes}</span>
          </p>
        </div>
        <div className="reply-text" style={{fontSize: "80%", wordWrap: 'break-word', marginLeft: 55}}>
          {reply.text}
        </div>
      </div>
    )
  }
};
