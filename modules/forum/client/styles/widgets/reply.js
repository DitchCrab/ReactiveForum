import {Styles} from 'material-ui';
const {Colors} = Styles;

export default {
  wrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: -10
  },

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
    paddingRight: 10
  },

  replyDiv: {
    fontSize: '0.8rem',
    wordWrap: 'break-word',
    marginLeft: 55
  },

  editingDiv: {
    width: '100%'
  },

  replyEditField: {
    width: '90%',
    fontSize: '0.9rem'
  }
}
