export default {
  wrapper: function(windowSize) {
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
    const style = {
      height: w_h,
      overflowY: windowSize === 'small' ? 'none' : 'auto',
      margin: 0,
    };
    return style;
  }
}
