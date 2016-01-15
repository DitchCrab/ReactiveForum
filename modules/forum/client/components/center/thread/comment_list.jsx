import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Components
import Comment from './comment';
import { IconButton, Styles } from 'material-ui';
import { NavigationMoreHoriz } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/center/thread/comment_list';
const { AutoPrefix } = Styles;
// Helpers
import Immutable from 'immutable';
import moment from 'moment';

export default class CommentList extends Component {
  static propTypes = {
    // If user sign in
    currentUser: PropTypes.object,
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
    onReplying: PropTypes.string
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
      timeMark: null
    };
    // Set initial timeMark
    if (!this.state.timeMark) {
      let mark = Immutable.fromJS(this.props.comments).takeLast(8).toJS();
      if (mark.length > 0) {
        this.state.timeMark =  mark[0].createdAt;          
      } else {
        this.state.timeMark = moment.utc().format();
      }
    };
    this.getMoreComments = this.getMoreComments.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);
    const same_comments = _.isEqual(this.props.comments, nextProps.comments);
    const same_list = _.isEqual(this.props.blacklist, nextProps.blacklist);
    const same_mark = this.state.timeMark === nextState.timeMark;
    const same_reply = this.props.onReplying === nextProps.onReplying;
    if (same_user && same_comments && same_list && same_mark && same_reply) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    if (this.props.comments.length < 1) {
      return <div/>
    }
    // Only render comments after timeMark
    let comments = Immutable.fromJS(this.props.comments).skipUntil(x => x.get('createdAt') >= this.state.timeMark).toJS();
    if (!comments) {
      return <div/>
    }
    let comment_list = comments.map((comment) => {
      if (Immutable.fromJS(this.props.blacklist).find(x => x === comment.userId)) {
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
        openReply: this.props.openReply.bind(null, comment._id)
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
    return (
      <div className="s-grid-top">
        <IconButton touch={true} style={ComponentStyle.iconButton} onClick={this.getMoreComments} className="more-comments">
          <NavigationMoreHoriz/>
        </IconButton>
        {comment_list}
      </div>
    )
  }

  // Decrease timeMark to view more comments
  getMoreComments() {
    let mark = Immutable.fromJS(this.props.comments).takeUntil(x => x.get('createdAt') >= this.state.timeMark).takeLast(8).toJS();
    if (mark.length > 0) {
      this.setState({timeMark: mark[0].createdAt});      
    }
  }
};


