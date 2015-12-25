import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { EditorInsertComment } from 'material-ui/lib/svg-icons';
import Reply from './reply';
import { Avatar, Styles } from 'material-ui';
const { Colors } = Styles;

export default class Comment extends Component {

  static propTypes = {
    comment: PropTypes.object,
    newReplyId: PropTypes.string,
    newCommentId: PropTypes.string,
    onCommend: PropTypes.func,
    onLike: PropTypes.func,
    onLikeReply: PropTypes.func,
    moveToReplyId: PropTypes.func,
    moveToCommentId: PropTypes.func
  }

  constructor(props) {
    super(props);
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
          key: reply._id,
          ref: reply._id,
          currentUser: this.props.currentUser,
          reply: reply,
          onLikeReply: this.props.onLikeReply.bind(null, index)          
        };
        if (this.props.newReplyId === reply._id) {
          reply_props.newReplyId = this.props.newReplyId;
          reply_props.moveToReplyId = this.props.moveToReplyId;
        }
        return <Reply {...reply_props}/>
      })
    };
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
              <span className="comment-like" onClick={this.props.onLike.bind(null, comment._id)}>Like: {comment.likes}</span>
            </p>
          </div>
          <div style={{display: 'inline-block', float: 'right', padding: 5}}>
            <EditorInsertComment className="insert-comment" color={Colors.grey500} style={{padding: 0}} onClick={this.props.onCommend.bind(null, comment._id)}/>
          </div>
        </div>
        <div>
          <div style={{paddingLeft: 30}}>
            <div className="comment-text" style={{fontSize: "80%", wordWrap: 'break-word', paddingLeft: 25, whiteSpace: 'pre'}}>
              {comment.text}
            </div>
            {replies}
          </div>
        </div>
      </div>
    )
  }
};
