import { Styles } from 'material-ui';
const { Colors } = Styles;

export default {
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItem: 'flex-start',
    margin: '0rem 0.625rem',
    paddingTop: '4.8rem',
  },
  leftNav: (windowSize) => {
    let style = {
      width: '100%',
      backgroundColor: Colors.white
    };
    switch (windowSize) {
      case 'medium':
        style.width = '33.33%';
//        style.padding = '0.625rem';
        break;
      case 'large':
        style.width = '25%';
//        style.padding = '0.625rem';
        break;
    }
    return style;
  },
  rightNav: (windowSize) => {
    let style = {
      width: '100%',
    };
    switch (windowSize) {
      case 'large':
        style.width = '16.67%';
        break;
    }
    return style;
  },
  mainThread: (windowSize) => {
    let style = {
      width: '100%',
    };
    switch (windowSize) {
      case 'medium':
        style.width = '66.66%';
        style.padding = '0rem 0.625rem';
        break;
      case 'large':
        style.width = '58.33%';
        style.padding = '0rem 0.625rem';
        break;
    }
    return style;
  }
}
