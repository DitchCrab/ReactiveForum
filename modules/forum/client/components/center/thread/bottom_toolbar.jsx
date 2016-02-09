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
    currentUser: PropTypes.object,
    openSnackbar: PropTypes.func,
    viewingCarousel: PropTypes.bool, // Carousel of viewed threads
    toggleCarousel: PropTypes.func,
    newMessages: PropTypes.number, // If viewed thread receive new messages
    createComment: PropTypes.func,
    windowSize: PropTypes.oneOf(['small', 'medium', 'large']),
  };

  static defaultProps = {
    viewingCarousel: false,
    newMessages: 0
  };
  
  constructor(props) {
    super(props);
    this.state = { comment: null};
    this.typing = this.typing.bind(this);
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
    const open_button =  <IconButton tooltip="Star" touch={true} onClick={this.props.toggleCarousel.bind(null)}><ActionViewCarousel/></IconButton>;
    const close_button = <NavigationClose />;
    const commending = this.state.comment ? true : false;
    return (
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
          { this.state.comment //Render right icons on comment event
           ? <ActionDone/>
           : <EditorModeEdit/> }
        </IconButton>
        { this.props.viewingCarousel //Render right icons when carousel open or not
         ? close_button
         : open_button }
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
    if (this.props.currentUser) {
      let comment = this.state.comment;
      //Reset comment toolbar
      this.refs.commentField.clearValue();
      this.setState({comment: null});
      if (comment && comment.length > 1) {
        this.props.createComment.bind(null, comment)();
      }
    } else {
      this.props.openSnackbar('Hi there, please log on to commend to this thread');
    }
  }
};

