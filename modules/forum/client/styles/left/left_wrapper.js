import { windowHeight } from 'forum/client/helpers';
import { Styles } from 'material-ui';
const { Colors } = Styles;

export default {
  wrapper: function(windowSize) {
    const w_h = windowHeight() - 100;
    let style= {};
    if (windowSize !== 'small') {
      style = {
        height: w_h,
        overflowY: 'auto',
        padding: '0.625rem'
      };
    };
    return style;
  },
  
  searchField: {
    width: '90%',
    padding: '5%'
  },

  dropDownDiv: {
    width: '100%',
    padding: '0.625rem 0rem',
  },

  dropDownHeader: {
    padding: '0rem 0.9375rem',
    color: Colors.cyan700
  },
  
  dropDownCategory: {
    width: '100%',
  },

  newThreadDiv: {
    position: 'fixed',
    bottom: 10,
    left: 10
  },

  newThreadButton: {
    backgroundColor: 'rgba(244, 67, 54, 1)',
    borderRadius: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'    
  }
}
