export default {
  wrapper: (function() {
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
    const style = {
      height: w_h
    };
    return style; 
  })(),
  
  list: {
    width: '100%',
  }
}
