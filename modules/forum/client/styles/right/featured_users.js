import { windowHeight } from 'forum/client/helpers';
export default {
  wrapper: (function() {
    let w_h = windowHeight() - 100;
    const style = {
      height: w_h
    };
    return style; 
  })(),
  
  list: {
    width: '100%',
  }
}
