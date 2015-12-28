import { Component, PropTypes } from 'react';
import { IconButton, List, ListItem, Avatar, Styles } from 'material-ui';
import { ToggleStarBorder, ImagePhoto } from 'material-ui/lib/svg-icons';
const { Colors } = Styles;

export default class Featured extends Component {
  static propTypes = {
    threads: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func,
    onUser: PropTypes.string
  }

  static defaultProps = {
    threads: []
  }

  constructor(props, context) {
    super(props);
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var cell_height;
    if (w_w >= 640 && w_w < 1200) {
      cell_height = 250
    } else if (w_w >= 1200) {
      cell_height = 300
    }
    if (!this.props.threads) {
      return <div/>
    }
    let threads = this.props.threads.map((thread, index) => {
      if (thread.user.avatar) {
        var thread_avatar = <Avatar src={thread.user.avatar} />;
      } else {
        var thread_avatar = <Avatar>{thread.user.username[0]}</Avatar>;
      };
      let des = <p><span style={{color: Colors.cyan700, fontWeight: 'bold'}}>{thread.user.username}</span> - {thread.description}</p>;
      const list_item_props = {
        key: thread._id,
        leftAvatar: thread_avatar,
        primaryText: thread.title,
        secondaryText: des,
        secondaryTextLines: 3,
        onTouchTap: this.props.viewThread.bind(null, thread._id)
      };
      if (thread.imgUrl) {
        list_item_props["rightAvatar"] = <Avatar src={thread.imgUrl} />;
      } else {
        list_item_props["rightIcon"] = <ImagePhoto />;
      }
      return (
        <ListItem {...list_item_props} />
      )
    });
    return (
      <List subheader={this.props.onUser ? "Contributed to threads" : "Featured"}>
        {threads}
      </List>
    )
  }
}

