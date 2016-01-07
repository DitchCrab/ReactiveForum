import { Component, PropTypes } from 'react';
import ThreadUsers from './thread_users';
import UserAvatars from 'forum/collections/user_avatars';
import { ContentInbox, ActionGrade } from 'material-ui/lib/svg-icons';
import { Avatar, List, ListItem, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/right/mini_profile';
const { Colors } = Styles;

export default class MiniProfile extends React.Component {
  static propTypes = {
    // if user signed in
    currentUser: PropTypes.object
  };
  
  constructor(props, context) {
    super(props);
    this.userLogout = this.userLogout.bind(this);
    // Image proccessing methods
    this._uploadImg = this._uploadImg.bind(this);
    this._resizeImg = this._resizeImg.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }

  render() {
    if (!this.props.currentUser) {
      return <div/>
    }
    let user = this.props.currentUser;
    var avatar = <Avatar>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        avatar = <Avatar src={user.profile.avatar}/>;
      }
    }
    return (
      <List style={ComponentStyle.list}>
        <div className="greeting-user" style={ComponentStyle.nameDiv}>Hello {user.username}</div>
        <ListItem primaryText="New Avatar" leftIcon={<ContentInbox />} >
          <input type="file" id="profileAvatarInput" style={ComponentStyle.fileInput} onChange={this._uploadImg} />
        </ListItem>
        <ListItem primaryText="Sign out" leftIcon={<ActionGrade />} onClick={this.userLogout} />
      </List>
    )
  }

  // Only availabe for modern browsers
  // Need fallback to send image directly to server on old browsers
  _uploadImg(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    let imageType = /^image\//;
    if (!imageType.test(file.type)) {
      return;
    }
    reader.onload = (upload) => {
      let canvas_img = this._resizeImg(upload.target.result);
    }
    reader.readAsDataURL(file);
  }

  _resizeImg(src) {
    var image = new Image();
    var canvas = document.createElement('canvas');
    image.onload = () => {
      var ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = canvas.width * (image.height / image.width);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      let new_img = canvas.toDataURL("image/jpeg", 0.7);
      this.updateAvatar(new_img);
    };
    image.src = src
  }

  updateAvatar(img) {
    UserAvatars.insert(img, (err, imgObj) => {
      Meteor.call('updateAvatar', imgObj._id, (err, res) => {
      })
    })
  }

  userLogout() {
    Meteor.logout((res, err) => {
    })
  }
};
