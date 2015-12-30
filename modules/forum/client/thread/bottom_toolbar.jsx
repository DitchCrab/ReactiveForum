import { Component, PropTypes } from 'react';
import { Toolbar, TextField, IconButton, Badge } from 'material-ui';
import { toolbarWidth } from 'forum/client/helpers';
import { ActionDone, EditorModeEdit, NavigationClose, ActionViewCarousel, CommunicationChatBubbleOutline } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/thread/bottom_toolbar';
import moment from 'moment';

export default class BottomToolbar extends Component {
  static propTypes = {
    toggleCarousel: PropTypes.func,
    viewingCarousel: PropTypes.bool,
    threadId: PropTypes.string,
    newMessages: PropTypes.number
  }

  static defaultProps = {
    viewingCarousel: false,
    newMessages: 0
  }
  
  constructor(props) {
    super(props);
    this.state = {comment: null, defaultHeight: 56, textFieldHeight: 24};
    this.typeComment = this.typeComment.bind(this);
    this.addCommentToThread = this.addCommentToThread.bind(this);
  }

  render() {
    let open_button =  <IconButton tooltip="Star" touch={true} onClick={this.props.toggleCarousel.bind(null)}><ActionViewCarousel/></IconButton>;
    let close_button = <NavigationClose />;
    return(
      <Toolbar style={ComponentStyle.toolbar(this.props.windowSize, this.state.defaultHeight)}>
        <TextField
            multiLine={true}
            ref="commentField"
            defaultValue={this.state.comment}
            style={ComponentStyle.textField(this.props.windowSize)}
            hintText="Commend"
            onChange={this.typeComment} />
        <IconButton
            tooltip="Star"
            touch={true}
            onClick={this.addCommentToThread}>
          { this.state.comment ? <ActionDone/> : <EditorModeEdit/> }
        </IconButton>
        { this.props.viewingCarousel ? close_button : open_button }
        <Badge
            badgeContent={this.props.newMessages}
            primary={true}
            badgeStyle={ComponentStyle.badge}>
          <CommunicationChatBubbleOutline />
        </Badge>
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

