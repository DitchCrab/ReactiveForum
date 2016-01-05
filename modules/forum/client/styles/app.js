import { windowHeight } from 'forum/client/helpers';
import { Styles } from 'material-ui';
const {Colors} = Styles;

export default {
  body: {
    backgroundColor: Colors.grey100,
    minHeight: windowHeight()
  },
  
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0
  },
  rightButton: function(user, windowSize) {
    var top = -4;
    if (!user && windowSize === 'large') {
      top = 4;
    } else if (user) {
      if (user.profile) {
        if (user.profile.avatar) {
          top = 4;
        } else if (!user.profile.avatar && windowSize === 'large') {
          top = 4;
        } 
      } else if (windowSize === 'large') {
        top = 4;
      }
    }
    return {
      display: 'inline-block',
      boxSizing: 'border-box',
      cursor: 'pointer',
      position: 'relative',
      marginLeft: 10,
      top: top
    }
  }
}
