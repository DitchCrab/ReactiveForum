export default {
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0
  },
  rightButton: function(user) {
    var top = -4;
    if (user) {
      top = 4;
    }
    return {
      display: 'inline-block',
      boxSizing: 'border-box',
      cursor: 'pointer',
      position: 'relative',
      marginLeft: 10,
      top: top
    }
  }
}
