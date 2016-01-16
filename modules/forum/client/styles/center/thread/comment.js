import {Styles} from 'material-ui';
const {Colors} = Styles;

export default {
  avatar: {
    display: 'inline-block',
    marginRight: 10,
    marginLeft: 5
  },

  header: {
    display: 'inline-block'
  },

  username: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: Colors.cyan700
  },

  actions: {
    fontSize: '0.6rem',
    color: 'rgba(182, 182, 182, 1)',
    paddingTop: 3
  },

  subAction: {
    paddingRight: 16
  },

  commentDiv: {
    paddingLeft: 30
  },

  comment: {
    fontSize: '0.8rem',
    wordWrap: 'break-word',
    paddingLeft: 25,
    paddingRight: 8,
    whiteSpace: 'pre-line'    
  },

  editingDiv: {
    width: '100%'
  },

  commentEditField: {
    width: '90%',
    fontSize: '0.9rem'
  },

  replyHeader: {
    color: Colors.grey500,
    paddingTop: 16
  }
}
