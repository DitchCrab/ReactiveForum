import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
// Components
import { List, ListItem, Checkbox, FlatButton, Styles, Avatar } from 'material-ui';
// Styles
import ComponentStyle from '../../styles/right/featured_users';
const {Colors} = Styles;

/**
* FeaturedUsers component
* Render on the right side in 'large' screen
* Render in RightNav in 'small' and 'medium' screen
* Click on user navigate to '/forum/user/:id'
*/
@ReactMixin.decorate(ReactMeteorData)
export default class FeaturedUsers extends Component {
  static propTypes = {
    onUser: PropTypes.func // Click to view user's threads
  };

  static defaultProps = {
    featuredUsers: []
  };

  constructor(props, context) {
    super(props);
    this.renderEachUser = this.renderEachUser.bind(this);
    this.linkToUserPost = this.linkToUserPost.bind(this);
  }

  componentWillMount() {
    this.featured_users_handler = Meteor.subscribe('featured-users');
  }

  getMeteorData() {
    // Get users with the most contribution
    let featured_users = Meteor.users.find({contribution: {$gt: 0}}, {sort: {contribution: -1}, limit: 20}).fetch();
    return {
      featuredUsers: featured_users
    }
  }

  componentWillUnmount() {
    this.featured_users_handler.stop();
  }
  
  render() {
    let user_list = this.data.featuredUsers.map((user, index) => this.renderEachUser(user, index));
    return (
      <div style={ComponentStyle.wrapper}>
        <List style={ComponentStyle.list} subheader="Best contributors">
          {user_list}
        </List>
      </div>
    )
  }

  renderEachUser(user, index) {
    const avatar = <Avatar>{user.username[0]}</Avatar>;
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
  
  // @params id {string} - userId
  linkToUserPost(id) {
    this.props.onUser.bind(null, id)();
  }

};

