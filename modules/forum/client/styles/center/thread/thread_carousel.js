import {toolbarWidth} from 'forum/client/utils/helpers';

export default {
  wrapper: function(windowSize) {
    const width = toolbarWidth(windowSize);    
    return {
      position: 'fixed',
      bottom: 56,
      height: 150,
      width: width,
      background: 'rgba(0, 0, 0, 0.2)',
      transition: 'transform 2s',
      transitionTimingFunction: 'ease-in',
    }
  },

  gridList: {
    maxHeight: '100%'
  },

  leftArrow: {
    position: 'absolute',
    left: -20,
    top: 50,
    zIndex: 9999
  },

  rightArrow: {
    position: 'absolute',
    right: -20,
    top: 50,
    zIndex: 9999
  }
}
