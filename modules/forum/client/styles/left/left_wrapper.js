import { windowHeight } from 'forum/client/helpers';
export default {
  wrapper: function(windowSize) {
    const w_h = windowHeight() - 100;
    let style= {};
    if (windowSize !== 'small') {
      style = {
        height: w_h,
        overflowY: 'auto'
      };
    };
    return style;
  },
  
  searchField: {
    width: '100%'
  },
  
  dropDownCategory: {
    width: '100%'
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
