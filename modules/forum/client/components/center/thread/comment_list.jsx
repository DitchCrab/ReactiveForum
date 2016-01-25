import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Components
import Comment from './comment';
import { IconButton, Styles } from 'material-ui';
import { NavigationMoreHoriz } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/center/thread/comment_list';
const { AutoPrefix } = Styles;
// Helpers
import moment from 'moment';

/**
* CommentList component
* Wrapper for comments and replies
* Responsible for number of comments rendered
*/
export default class CommentList extends Component {
  static propTypes = {
    // If user sign in
    currentUser: PropTypes.object,
    thread: PropTypes.object,
    // Thread comments
    comments: PropTypes.array,
    // Filtered users
    blacklist: PropTypes.array,
    // State of new comment or reply just created
    newCommentId: PropTypes.string,
    newReplyHash: PropTypes.object,
    // Callback for server methods
    onLike: PropTypes.func,
    onLikeReply: PropTypes.func,
    updateComment: PropTypes.func,
    updateReply: PropTypes.func,
    createReply: PropTypes.func,
    closeReply: PropTypes.func,
    openReply: PropTypes.func,
    onReplying: PropTypes.string,
    openSnackbar: PropTypes.func
  };

  static defaultProps = {
    comments: [],
    blacklist: [],
    newReplyHash: {}
  };
  
  constructor(props) {
    super(props);
    this.state = {
      // Only show comments after this timeMark
      viewNumber: 8
    };
    this.getMoreComments = this.getMoreComments.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.thread) {
      // If there are new comments, add to viewNumber
      if (this.props.thread._id === nextProps.thread._id) {
        this.setState({viewNumber: this.state.viewNumber + nextProps.thread.comments.length - this.props.thread.comments.length});
      } else {
        // If thread is different, reset viewNumber
        this.setState({viewNumber: 8});
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);
    const same_comments = _.isEqual(this.props.comments, nextProps.comments);
    const same_list = _.isEqual(this.props.blacklist, nextProps.blacklist);
    const same_view_number = this.state.viewNumber === nextState.viewNumber;
    const same_reply = this.props.onReplying === nextProps.onReplying;
    if (same_user && same_comments && same_list && same_view_number && same_reply) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    if (this.props.comments.length < 1) {
      return <div/>
    }
    let comments = _.last(this.props.comments, this.state.viewNumber);
    if (!comments) {
      return <div/>
    }
    let comment_list = comments.map((comment) => {
      if (_.find(this.props.blacklist, user => user === comment.userId)) {
        return <div/>;
      }
      let comment_props = {
        currentUser: this.props.currentUser,
        newCommentId: this.props.newCommentId,
        comment: comment,
        onLike: this.props.onLike.bind(null),
        onLikeReply: this.props.onLikeReply.bind(null, comment._id),
        updateComment: this.props.updateComment.bind(null, comment._id),
        updateReply: this.props.updateReply.bind(null, comment._id),
        createReply: this.props.createReply.bind(null, comment._id),
        onReplying: this.props.onReplying,
        closeReply: this.props.closeReply,
        openReply: this.props.openReply.bind(null, comment._id),
        openSnackbar: this.props.openSnackbar
      };
      if (comment._id === this.props.newReplyHash.commentId) {
        comment_props.newReplyId = this.props.newReplyHash.replyIndex;
      }
      return (
        <div key={comment._id} ref={comment._id} style={AutoPrefix.all(ComponentStyle.wrapper)}>
          <Comment  {...comment_props}/>
        </div>
      )
    });
    const viewMoreIcon =  (
      <IconButton touch={true} style={ComponentStyle.iconButton} onClick={this.getMoreComments} className="more-comments">
        <NavigationMoreHoriz/>
      </IconButton>);

    return (
      <div className="s-grid-top">
        { this.state.viewNumber > comments.length ? null : viewMoreIcon}
        {comment_list}
      </div>
    )
  }

  getMoreComments() {
    this.setState({viewNumber: this.state.viewNumber + 8});
  }
};


