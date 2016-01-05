import { windowHeight } from 'forum/client/helpers';
import {Styles} from 'material-ui';
const {Colors} = Styles;

export default {
  wrapper: (function() {
    let w_h = windowHeight() - 80;
    return {
      backgroundColor: Colors.white,
      height: w_h,
      padding: '0.625rem'
    }
  })(),

  selectDiv: {
    padding: '0rem 0.625rem'
  },

  selectButtons: {
    display: 'inline-block',
    boxSizing: 'border-box'
  },

  text: {
    fontSize: '0.875rem',
    paddingRight: '0.625rem',
    color: Colors.grey500
  },
  
  button: {
    minWidth: 50
  },

  checkBox: {
    width: 30,
    paddingTop: 10
  }
  
}
