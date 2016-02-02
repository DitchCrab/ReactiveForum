import { toolbarWidth } from 'forum/client/utils/helpers';

export default {
  toolbar: function(windowSize, commending) {
    const width = toolbarWidth(windowSize);
    let style = {
      position: 'fixed',
      bottom: -5,
      width: width,
      height: 'initial',
      margin: 0,
      padding: "0px 5px 0px 5px",
      textAlign: "center",
      display: 'inline-block'
    };
    if (commending && windowSize === 'small') {
      style.position = 'initial';
    }
    return style;
  },

  textField: function(windowSize, commending) {
    const width = toolbarWidth(windowSize);
    let style = {
      width: width - 170,
      top: -15
    };
    if (commending) {
      style.width = width - 20;
      style.top = 0;
    }
    return style;
  },

  badge: {
    top: 12,
    right: 12
  },

  iconsWrapper: {
  }
}
