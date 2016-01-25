import { Component, PropTypes } from 'react';
// Components
import { Toolbar, TextField, IconButton, Badge } from 'material-ui';
import { ActionDone, EditorModeEdit, NavigationClose, ActionViewCarousel, CommunicationChatBubbleOutline } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/center/thread/bottom_toolbar';
// Helpers
import moment from 'moment';

/**
* BottomToolbar component
* Handling user comment input
* Open or close carousel
* Notify user if there is unread messages in a thread
*/
export default class BottomToolbar extends Component {
  static propTypes = {
    // If carousel is currently open or not
    viewingCarousel: PropTypes.bool,
    // Notification if receive new messages in a thread
    newMessages: PropTypes.number,
    // Callback to open or close carousel
    toggleCarousel: PropTypes.func,
    // Callback with param to move to specific comment just created by user
    createComment: PropTypes.func,
    windowSize: PropTypes.string,
  };

  static defaultProps = {
    viewingCarousel: false,
    newMessages: 0
  };
  
  constructor(props) {
    super(props);
    this.state = { comment: null};
    this.typing = this.typing.bind(this);
    // call server method
    this.addCommentToThread = this.addCommentToThread.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_carousel = this.props.viewingCarousel === nextProps.viewingCarousel;
    const same_messages_count = this.props.newMessages === nextProps.newMessages;
    const same_comment = this.state.comment === nextState.comment;
    if (same_carousel && same_messages_count && same_comment) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    let open_button =  <IconButton tooltip="Star" touch={true} onClick={this.props.toggleCarousel.bind(null)}><ActionViewCarousel/></IconButton>;
    let close_button = <NavigationClose />;
    let commending = this.state.comment ? true : false;
    return(
      <Toolbar style={ComponentStyle.toolbar(this.props.windowSize, commending)}>
        <TextField
            multiLine={true}
            ref="commentField"
            defaultValue={this.state.comment}
            style={ComponentStyle.textField(this.props.windowSize, commending)}
            hintText="Commend"
            onChange={this.typing}/>
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

  // Get comment value for controlled field
  typing(e) {
    e.preventDefault();
    this.setState({comment: e.target.value});
  }

  // Handling submit comment action
  addCommentToThread(e) {
    e.preventDefault();
    e.stopPropagation();
    let comment = this.state.comment;
    //Reset comment toolbar
    this.refs.commentField.clearValue();
    this.setState({comment: null});
    if (comment && comment.length > 1) {
      this.props.createComment.bind(null, comment)();
    }
  }
};

