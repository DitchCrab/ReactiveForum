import { Component, PropTypes } from 'react';
import ThreadUsers from './thread_users';
import UserAvatars from 'forum/collections/user_avatars';
import { ContentInbox, ActionGrade } from 'material-ui/lib/svg-icons';
import { Avatar, List, ListItem, Styles } from 'material-ui';
const { Colors } = Styles;

export default class MiniProfile extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object
  }
  
  constructor(props, context) {
    super(props);
    this.userLogout = this.userLogout.bind(this);
    this._uploadImg = this._uploadImg.bind(this);
    this._resizeImg = this._resizeImg.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
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
    const input_style = {
      cursor: "pointer",
      position: "absolute",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      width: "100%",
      opacity: "0"
    };
    return (
      <List style={{width: 200}}>
        <div className="greeting-user" style={{fontWeight: 'bold', color: Colors.cyan700, textAlign: 'center', padding: 5}}>Hello {user.username}</div>
        <ListItem primaryText="New Avatar" leftIcon={<ContentInbox />} >
          <input type="file" id="profileAvatarInput" style={input_style} onChange={this._uploadImg} />
        </ListItem>
        <ListItem primaryText="Sign out" leftIcon={<ActionGrade />} onClick={this.userLogout} />
      </List>
    )
  }

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
