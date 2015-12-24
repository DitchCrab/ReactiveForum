import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { EditorInsertComment } from 'material-ui/lib/svg-icons';
import Reply from './reply';
import { Avatar, Styles } from 'material-ui';
const { Colors } = Styles;

export default class Comment extends Component {
  constructor(props) {
    super(props);
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
        return <Reply key={reply._id} ref={reply._id} reply={reply} onLikeReply={this.props.onLikeReply.bind(null, index)}/>
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

  componentDidUpdate() {
    if (Session.get("moveToCommentId")) {
      let view = ReactDOM.findDOMNode(this.refs[Session.get("moveToCommentId")]);
      if (view) {
        view.scrollIntoView();
        Session.set("moveToCommentId", null);
      }
    }
  }
};

Comment.propTypes = {
  comment: PropTypes.object,
  onCommend: PropTypes.func,
  onLike: PropTypes.func,
  onLikeReply: PropTypes.func
}
