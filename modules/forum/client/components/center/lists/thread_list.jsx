import { Component, PropTypes } from 'react';
// Components
import { IconButton, List, ListItem, Avatar, Styles } from 'material-ui';
import { ToggleStarBorder, ImagePhoto } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/center/lists/thread_list';
const { Colors } = Styles;

/**
* ThreadList component
* Render list of thread passed by Features  or User
*/
export default class ThreadList extends Component {
  static propTypes = {
    threads: PropTypes.arrayOf(PropTypes.object), // List of thread passed by Featured or Users' thread
    viewThread: PropTypes.func
  };

  constructor(props) {
    super(props);
  }
  
  render() {
    if (!this.props.threads) { // If no thread, return blank div
      return <div/>;
    }
    let featuredThreads = this.props.threads.map((thread, index) => {
      let thread_avatar = null;
      if (thread.user.avatar) { // Render user avatar if exist; otherwise render first username letter
        thread_avatar = <Avatar src={thread.user.avatar} />;
      } else {
        thread_avatar = <Avatar>{thread.user.username[0]}</Avatar>;
      };
      const des = <p style={ComponentStyle.description}><span style={ComponentStyle.user}>{thread.user.username}</span> - {thread.description}</p>;
      const list_item_props = {
        key: thread._id,
        leftAvatar: thread_avatar,
        primaryText: thread.title,
        secondaryText: des,
        secondaryTextLines: 2,
        onTouchTap: this.props.viewThread.bind(null, thread._id)
      };
      if (thread.imgUrl) { // Render user avatar if exist; other render ImagePhoto
        list_item_props["rightAvatar"] = <Avatar src={thread.imgUrl} style={ComponentStyle.threadImg}/>;
      } else {
        list_item_props["rightIcon"] = <ImagePhoto />;
      }
      return (
        <ListItem {...list_item_props}/>
      )
    });
    return (
      <List>
        {featuredThreads}
      </List>
    )
  }

}
