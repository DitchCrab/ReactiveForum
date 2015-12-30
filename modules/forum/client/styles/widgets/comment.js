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
    paddingRight: 10
  },

  insertCommentDiv: {
    display: 'inline-block',
    float: 'right',
    padding: 5
  },

  insertIcon: {
    padding: 0,
    marginRight: 10
  },

  commentDiv: {
    paddingLeft: 30
  },

  comment: {
    fontSize: '0.8rem',
    wordWrap: 'break-word',
    paddingLeft: 25,
    whiteSpace: 'pre'    
  },

  editingDiv: {
    width: '100%'
  },

  commentEditField: {
    width: '90%',
    fontSize: '0.9rem'
  }
}
