import { windowSize, windowHeight } from 'forum/client/utils/helpers';

export default {
  wrapper: (function() {
    var bg;
    switch (windowSize()) {
      case 'large':
        bg = require('../img/bgL.jpg');
        break;
      case 'medium':
        bg = require('../img/bgM.jpg');
        break;
      case 'small':
        bg = require('../img/bgS.jpg');
    };
    return {
      height: windowHeight(),
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top'
    }
  })(),
  nav: (function() {
    var height;
    switch (windowSize()) {
      case 'large':
        height = windowHeight() * 0.3;
        break;
      case 'medium':
        height = windowHeight() * 0.27;
        break;
      case 'small':
        height = windowHeight() * 0.23;
        break;
    }
    return {
      width: '100%',
      fontSize: '1.5rem',
      padding: '1.25rem',
      height: height
    }
  })(),
  main: (function() {
    var width;
    var fontSize = '2rem';
    switch (windowSize()) {
      case 'large':
        width = '30%';
        break;
      case 'medium':
        width = '35%';
        break;
      case 'small':
        width = '75%';
        fontSize = '1.8rem';
        break;
    }
    return {
      width: width,
      margin: 'auto',
      padding: '1.25rem',
      fontSize: fontSize,
      textAlign: 'center',
    }
  })(),

  button: {
    minHeight: 44
  }
}
