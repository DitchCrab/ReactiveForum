import {Styles} from 'material-ui';
const {Colors} = Styles;

export default {
  card: {
    paddingBottom: 80,
  },
  
  headerTitle: {
    fontWeight: 'bold',
    color: Colors.cyan700
  },

  img: {
    minHeight: 80,
  },

  cardContainer: {
    textAlign: 'right',
    margin: 0,
    padding: 0
  },

  cardAction: {
    margin: 0,
    padding: 0
  },

  subNote: {
    display: 'inline-block',
    fontSize: '0.6rem'
  },

  share: {
    marginLeft: 10,
    marginRight: 10
  },

  socialShare: {
    textAlign: 'center'
  },

  replyField: {
    width: '100%'
  },

  description: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-line'
  }
}
