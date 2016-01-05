import { windowHeight } from 'forum/client/helpers';
import { Styles } from 'material-ui';
const { Colors } = Styles;

export default {
  wrapper: (function() {
    let w_h = windowHeight() - 80;
    return {
      backgroundColor: Colors.white,
      height: w_h
    };
  })(),
  
  list: {
    width: '100%',
  }
}
