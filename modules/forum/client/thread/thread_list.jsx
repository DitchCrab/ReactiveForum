import { Component, PropTypes } from 'react';
import { IconButton, List, ListItem, Avatar, Styles } from 'material-ui';
import { ToggleStarBorder, ImagePhoto } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/thread/featured';
const { Colors } = Styles;

export default class ThreadList extends Component {
  static propTypes = {
    threads: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func
  };

  constructor(props) {
    super(props);
  }
  
  render() {
    if (!this.props.threads) {
      return <div/>
    }
    let featuredThreads = this.props.threads.map((thread, index) => {
      if (thread.user.avatar) {
        var thread_avatar = <Avatar src={thread.user.avatar} />;
      } else {
        var thread_avatar = <Avatar>{thread.user.username[0]}</Avatar>;
      };
      let des = <p style={ComponentStyle.description}><span style={ComponentStyle.user}>{thread.user.username}</span> - {thread.description}</p>;
      const list_item_props = {
        key: thread._id,
        leftAvatar: thread_avatar,
        primaryText: thread.title,
        secondaryText: des,
        secondaryTextLines: 2,
        onTouchTap: this.props.viewThread.bind(null, thread._id)
      };
      if (thread.imgUrl) {
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
