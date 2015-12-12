import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Comment from './comment';
import Immutable from 'immutable';
import moment from 'moment';
import { IconButton } from 'material-ui';
import { NavigationMoreHoriz } from 'material-ui/lib/svg-icons';

export default class CommentList extends Component {
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
      return (
        <div key={comment._id} ref={comment._id} className="s-grid-cell s-grid-cell-sm-12" style={{margin: 0, flexBasis: "100%", paddingTop: 5}}>
          <Comment comment={comment} onLike={this.props.onLike.bind(null) } onCommend={this.props.onCommend.bind(null)} onLikeReply={this.props.onLikeReply.bind(null, comment._id)}/>
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

  componentDidUpdate() {
    if (Session.get("moveToCommentId")) {
      let view = ReactDOM.findDOMNode(this.refs[Session.get("moveToCommentId")]);
      if (view) {
        view.scrollIntoView();
        Session.set("moveToCommentId", null);
      }
    }
  }

  getMoreComments() {
    let mark = Immutable.fromJS(this.props.comments).takeUntil(x => x.get('createdAt') >= this.state.timeMark).takeLast(2).toJS();
    if (mark.length > 0) {
      this.setState({timeMark: mark[0].createdAt});      
    }
  }
};

CommentList.propTypes = {
  comments: PropTypes.array,
  notSeenUser: PropTypes.array,
  onLike: PropTypes.func,
  onCommend: PropTypes.func,
  onLikeReply: PropTypes.func
};

CommentList.defaultProps = {
  comments: [],
  notSeenUser: []
};

