import { Component, PropTypes } from 'react';
import { List, ListItem, Checkbox, FlatButton, Styles, Avatar } from 'material-ui';
import ComponentStyle from 'forum/client/styles/right/featured_users';
const {Colors} = Styles;

export default class FeaturedUsers extends Component {
  static propTypes = {
    // lIst of users which has the most threads and comments
    featuredUsers: PropTypes.arrayOf(PropTypes.object),
    // Callback when click on user avatar
    onUser: PropTypes.func
  }

  static defaultProps = {
    featuredUsers: []
  }

  constructor(props, context) {
    super(props);
    this.renderEachUser = this.renderEachUser.bind(this);
    this.linkToUserPost = this.linkToUserPost.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.featuredUsers, nextProps.featuredUsers);
  }
  
  render() {
    let user_list = this.props.featuredUsers.map((user, index) => this.renderEachUser(user, index));
    return (
      <div style={ComponentStyle.wrapper}>
        <List style={ComponentStyle.list} subheader="Best contributors">
          {user_list}
        </List>
      </div>
    )
  }

  renderEachUser(user, index) {
    let avatar = <Avatar>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        avatar = <Avatar src={user.profile.avatar} />;
      }
    }
    return (
      <ListItem
          key={user._id}
          leftAvatar={avatar}
          primaryText={user.username}
          onTouchTap={this.linkToUserPost.bind(null, user._id)}
      >
      </ListItem>
    )
  }

  linkToUserPost(id) {
    this.props.onUser.bind(null, id)();
  }

};

