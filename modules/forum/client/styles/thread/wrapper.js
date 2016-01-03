import { windowHeight } from 'forum/client/helpers';

export default {
  wrapper: function(windowSize) {
    let w_h = windowHeight() - 100;
    const style = {
      height: w_h,
      overflowY: windowSize === 'small' ? 'none' : 'auto',
      margin: 0,
    };
    return style;
  }
}
