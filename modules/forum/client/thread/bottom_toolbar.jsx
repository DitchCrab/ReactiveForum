import { Component, PropTypes } from 'react';
import { Toolbar, TextField, IconButton } from 'material-ui';
import { ActionDone, EditorModeEdit, NavigationClose, ActionViewCarousel } from 'material-ui/lib/svg-icons';
import moment from 'moment';

export default class BottomToolbar extends Component {
  static propTypes = {
    toggleCarousel: PropTypes.func,
    viewingCarousel: PropTypes.bool,
    threadId: PropTypes.string
  }

  static defaultProps = {
    viewingCarousel: false
  }
  
  constructor(props) {
    super(props);
    this.state = {comment: null, defaultHeight: 56, textFieldHeight: 24};
    this.typeComment = this.typeComment.bind(this);
    this.addCommentToThread = this.addCommentToThread.bind(this);
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var width;
    if (w_w >= 1200) {
      width = w_w * 7 / 12 - 40
    } else if (w_w >= 640 && w_w < 1200) {
      width = w_w / 2 - 40
    } else {
      width = w_w - 20
    }
    let toolbar_style = {
      position: 'fixed',
      bottom: 0,
      width: width,
      height: this.state.defaultHeight,
      margin: 0,
      padding: "0px 5px 10px 5px",
      textAlign: "center"
    };
    let textfield_style = {
      width: width * 0.60
    };
    let open_button =  <IconButton tooltip="Star" touch={true} onClick={this.props.toggleCarousel.bind(null)}><ActionViewCarousel/></IconButton>;
    let close_button = <NavigationClose />;
    return(
      <Toolbar style={toolbar_style}>
        <TextField multiLine={true} ref="commentField" defaultValue={this.state.comment} style={textfield_style} hintText="Commend" onChange={this.typeComment} />
        <IconButton tooltip="Star" touch={true} onClick={this.addCommentToThread}>
          {this.state.comment ? <ActionDone/> : <EditorModeEdit/>}
        </IconButton>
        { this.props.viewingCarousel ? close_button : open_button }
      </Toolbar>          
    )
  }

  typeComment(event) {
    event.preventDefault();
    let comment = this.refs.commentField.getValue();
    this.setState({comment: comment});
    let new_height = event.target.clientHeight;
    let old_height = this.state.textFieldHeight;
    if (new_height > old_height) {
      this.setState({textFieldHeight: new_height, defaultHeight: this.state.defaultHeight + 24});
    } else if (new_height < old_height) {
      this.setState({textFieldHeight: new_height, defaultHeight: this.state.defaultHeight - 24});        
    }
  }

  addCommentToThread() {
    let comment = this.state.comment;
    if (comment && comment.length > 1) {
      Meteor.call('createComment', this.props.threadId, comment, (err, res) => {
        if (!err) {
          this.props.moveToCommentId.bind(null, res)();
        }
      })
    }
    this.refs.commentField.clearValue();
    this.setState({comment: null, defaultHeight: 56, textFieldHeight: 24});
  }
};

