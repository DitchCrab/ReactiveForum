import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Comment from './comment';
import Immutable from 'immutable';
import moment from 'moment';
import { IconButton } from 'material-ui';
import { NavigationMoreHoriz } from 'material-ui/lib/svg-icons';

export default class CommentList extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    comments: PropTypes.array,
    notSeenUser: PropTypes.array,
    newCommentId: PropTypes.string,
    newReplyId: PropTypes.arrayOf(PropTypes.string),
    onLike: PropTypes.func,
    onCommend: PropTypes.func,
    onLikeReply: PropTypes.func,
    moveToCommentId: PropTypes.func,
    moveToReplyId: PropTypes.func,
    updateComment: PropTypes.func,
    updateReply: PropTypes.func
  }

  static defaultProps = {
    comments: [],
    notSeenUser: [],
    newReplyId: [],
  }
  
  constructor(props) {
    super(props);
    this.state = {timeMark: null};
    if (!this.state.timeMark) {
      let mark = Immutable.fromJS(this.props.comments).takeLast(2).toJS();
      if (mark.length > 0) {
        this.state.timeMark =  mark[0].createdAt;          
      } else {
        this.state.timeMark = moment.utc().format();
      }
    };
    this.getMoreComments = this.getMoreComments.bind(this);
  }

  render() {
    if (this.props.comments.length < 1) {
      return <div/>
    }
    let comments = Immutable.fromJS(this.props.comments).skipUntil(x => x.get('createdAt') >= this.state.timeMark).toJS();
    if (!comments) {
      return <div/>
    }
    let comment_list = comments.map((comment) => {
      if (Immutable.fromJS(this.props.notSeenUser).find(x => x === comment.userId)) {
        return <div/>
      }
      let comment_props = {
        currentUser: this.props.currentUser,
        newCommentId: this.props.newCommentId,
        moveToCommentId: this.props.moveToCommentId.bind(null),
        comment: comment,
        onLike: this.props.onLike.bind(null),
        onCommend: this.props.onCommend.bind(null),
        onLikeReply: this.props.onLikeReply.bind(null, comment._id),
        updateComment: this.props.updateComment.bind(null, comment._id),
        updateReply: this.props.updateReply.bind(null, comment._id)
      };
      if (comment._id === this.props.newReplyId[0]) {
        comment_props.newReplyId = this.props.newReplyId[1];
        comment_props.moveToReplyId = this.props.moveToReplyId.bind(null, []);
      }
      return (
        <div key={comment._id} ref={comment._id} className="s-grid-cell s-grid-cell-sm-12" style={{margin: 0, flexBasis: "100%", paddingTop: 5}}>
          <Comment  {...comment_props}/>
        </div>
      )
    });
    return (
      <div className="s-grid-top">
        <IconButton touch={true} style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={this.getMoreComments} className="more-comments">
          <NavigationMoreHoriz/>
        </IconButton>
        {comment_list}
      </div>
    )
  }

  getMoreComments() {
    let mark = Immutable.fromJS(this.props.comments).takeUntil(x => x.get('createdAt') >= this.state.timeMark).takeLast(2).toJS();
    if (mark.length > 0) {
      this.setState({timeMark: mark[0].createdAt});      
    }
  }
};


