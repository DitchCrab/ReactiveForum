import { Component } from 'react';
import ThreadUsers from './thread_users';
import { ContentInbox, ActionGrade } from 'material-ui/lib/svg-icons';
import { Avatar, List, ListItem, Styles } from 'material-ui';
const { Colors } = Styles;

export default class MiniProfile extends React.Component {
  constructor(props, context) {
    super(props);
    this.userLogout = this.userLogout.bind(this);
  }

  render() {
    if (!this.props.currentUser) {
      return <div/>
    }
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let user = this.props.currentUser;
    var avatar = <Avatar>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        avatar = <Avatar src={user.profile.avatar}/>;
      }
    }
    return (
      <List style={{width: 200}}>
        <div className="greeting-user" style={{fontWeight: 'bold', color: Colors.cyan700, textAlign: 'center', padding: 5}}>Hello {user.username}</div>
        <ListItem primaryText="Edit profile" leftIcon={<ContentInbox />} />
        <ListItem primaryText="Sign out" leftIcon={<ActionGrade />} onClick={this.userLogout} />
      </List>
    )
  }

  userLogout() {
    Meteor.logout((res, err) => {
    })
  }
};
