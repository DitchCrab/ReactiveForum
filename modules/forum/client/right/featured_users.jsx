import { Component, PropTypes } from 'react';
import { List, ListItem, Checkbox, FlatButton, Styles, Avatar } from 'material-ui';
const {Colors} = Styles;

export default class FeaturedUsers extends Component {
  static propTypes = {
    featuredUsers: PropTypes.arrayOf(PropTypes.object),
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

  render() {
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
    const wrapper_style = {
      height: `${w_h}px`
    };
    let user_list = this.props.featuredUsers.map((user, index) => this.renderEachUser(user, index));
    return (
      <div className="s-grid-top" style={wrapper_style}>
        <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-top">
          <List subheader="Best contributors">
            {user_list}
          </List>
        </div>
      </div>
    )
  }

  renderEachUser(user, index) {
    let avatar = <Avatar>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        <Avatar src={user.profile.avatar} />;
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

