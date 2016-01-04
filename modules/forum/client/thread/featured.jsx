import { Component, PropTypes } from 'react';
import { IconButton, List, ListItem, Avatar, Styles } from 'material-ui';
import { ToggleStarBorder, ImagePhoto } from 'material-ui/lib/svg-icons';
import ComponentStyle from 'forum/client/styles/thread/featured';
const { Colors } = Styles;

export default class Featured extends Component {
  static propTypes = {
    // List of threads queried
    threads: PropTypes.arrayOf(PropTypes.object),
    // Callback when click on list item
    viewThread: PropTypes.func,
    // Pass on when queried threads by particular user
    viewUser: PropTypes.object
  }

  static defaultProps = {
    threads: []
  }

  constructor(props, context) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.threads, nextProps.threads);
  }

  render() {
    if (!this.props.threads) {
      return <div/>
    }
    let threads = this.props.threads.map((thread, index) => {
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
      <List subheader={this.props.viewUser ? `${this.props.viewUser.username} contributed to threads` : 'Featured'}>
        {threads}
      </List>
    )
  }
}

