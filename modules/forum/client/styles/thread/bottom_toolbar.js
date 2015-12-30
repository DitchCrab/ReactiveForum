import { toolbarWidth } from 'forum/client/helpers';

export default {
  toolbar: function(windowSize, height) {
    const width = toolbarWidth(windowSize);
    let style = {
      position: 'fixed',
      bottom: 0,
      width: width,
      height: height,
      margin: 0,
      padding: "0px 5px 10px 5px",
      textAlign: "center"
    };
    return style;
  },

  textField: function(windowSize) {
    const width = toolbarWidth(windowSize);
    let style = {
      width: width - 170,
      top: -15
    };
    return style;
  },

  badge: {
    top: 12,
    right: 12
  }
}
