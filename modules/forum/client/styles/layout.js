export default {
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItem: 'flex-start',
    marginTop: '3.2rem',
    margin: '0.625rem'
  },
  leftNav: (windowSize) => {
    let style = {
      width: '100%',
    };
    switch (windowSize) {
      case 'medium':
        style.width = '31.67%';
        break;
      case 'large':
        style.width = '23.33%';
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
        style.width = '15%';
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
        break;
      case 'large':
        style.width = '60%';
        break;
    }
    return style;
  }
}
