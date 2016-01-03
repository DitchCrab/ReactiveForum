import { windowHeight } from 'forum/client/helpers';
import {Styles} from 'material-ui';
const {Colors} = Styles;

export default {
  wrapper: (function() {
    let w_h = windowHeight() - 100;
    return {
      height: w_h,
      padding: '0.625rem'
    }
  })(),

  text: {
    fontSize: '0.8rem',
    color: Colors.grey
  },
  
  button: {
    minWidth: 50
  },

  checkBox: {
    width: 30,
    paddingTop: 10
  }
  
}
