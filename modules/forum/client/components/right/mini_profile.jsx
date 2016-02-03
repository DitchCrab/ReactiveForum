import { Component, PropTypes } from 'react';
// Components
import ThreadUsers from './thread_users';
import { ContentInbox, ActionGrade } from 'material-ui/lib/svg-icons';
import { Avatar, List, ListItem, Styles } from 'material-ui';
import ComponentStyle from '../../styles/right/mini_profile';
const { Colors } = Styles;
// Collections
import UserAvatars from '../../../collections/user_avatars';

/**
* MiniProfile component
* Is render in Popover on top right side of screen
* Include upload new avatar form & signout button
*/
export default class MiniProfile extends Component {
  static propTypes = {
    currentUser: PropTypes.object, // User signed in object
    signOut: PropTypes.func,
    updateUserAvatar: PropTypes.func
  };
  
  constructor(props, context) {
    super(props);
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
        <ListItem primaryText="Sign out" leftIcon={<ActionGrade />} onClick={this.props.signOut} />
      </List>
    )
  }

  /**
   * Read file using file reader
   * Only for modern browsers
   * Will need fallback to iframe 
   */
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

  /**
   * User canvas to resize image
   * Reduce upload time for avatar
   */
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

  // @params img {DataUrlObject}
  updateAvatar(img) {
    this.props.updateUserAvatar(img);
  }
};
