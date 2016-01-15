import { Styles } from 'material-ui';
const { Colors } = Styles;

export default {
  wrapper: {
    backgroundColor: Colors.white,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: '0.625rem',
    minHeight: '100%'
  },

  header: {
    width: '100%',
    color: Colors.grey500,
    padding: '0.625rem 0rem'
  },

  div: {
    width: '100%',
  },

  imageDiv: {
    width: '100%',
    padding: '0.625rem 0rem',
    textAlign: 'center'
  },

  buttonDiv: {
    width: '100%',
    padding: '0.625rem 0rem',
    textAlign: 'center'
  },
  
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  },

  image: {
    width: 100,
    height: 100
  },

  error: {
    width: '100%',
    color: Colors.red500
  }
}
