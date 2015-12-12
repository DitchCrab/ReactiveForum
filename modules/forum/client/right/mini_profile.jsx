import { Component } from 'react';
import ReactMixin from 'react-mixin';
import ThreadUsers from './thread_users';
import { ContentInbox, ActionGrade } from 'material-ui/lib/svg-icons';
import { Avatar, List, ListItem, Styles } from 'material-ui';
const { Colors } = Styles;

@ReactMixin.decorate(ReactMeteorData)
export default class MiniProfile extends React.Component {
  constructor(props, context) {
    super(props);
    this.userLogout = this.userLogout.bind(this);
  }

  getMeteorData() {
    return {
      user: Meteor.user()
    }
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let user = this.data.user;
    var avatar = <Avatar>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        avatar = <Avatar src={user.profile.avatar}/>;
      }
    }
    return (
      <List style={{width: 200}}>
        <div style={{fontWeight: 'bold', color: Colors.cyan700, textAlign: 'center', padding: 5}}>Hello {user.username}</div>
        <ListItem primaryText="Edit profile" leftIcon={<ContentInbox />} />
        <ListItem primaryText="Sign out" leftIcon={<ActionGrade />} onClick={this.userLogout} />
        {w_w < 640 ? <ThreadUsers/> : null }
      </List>
    )
  }

  userLogout() {
    Meteor.logout((res, err) => {
      console.log(res);
      console.log(err);
    })
  }
};
