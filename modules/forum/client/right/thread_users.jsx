import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { List, ListItem, Checkbox, FlatButton, Styles, Avatar } from 'material-ui';
import Immutable from 'immutable';
import ComponentStyle from 'forum/client/styles/right/thread_users';
const {Colors} = Styles;

@ReactMixin.decorate(ReactMeteorData)
  export default class ThreadUsers extends Component {
    static propTypes = {
      // List of users who commended in thread
      threadUsers: PropTypes.arrayOf(PropTypes.string),
      // List of users which you don't want to see
      userBlackList: PropTypes.arrayOf(PropTypes.string),
      // Callback to update blacklist
      updateBlackList: PropTypes.func.isRequired,
      // Callback to view threads which user contributed to
      onUser: PropTypes.func.isRequired
    }

    static defaultProps = {
      threadUsers: [],
      userBlackList: []
    }
    
    constructor(props, context) {
      super(props);
      this.state = {
        userList: []
      };
      this.linkToUserPost = this.linkToUserPost.bind(this);
      // Fire when select on unselect particular user
      this.filterUser = this.filterUser.bind(this);
      // Fire when user choose 'all' or 'none'
      this.makeSelection = this.makeSelection.bind(this);
      // Decoupling from main render method
      this.renderEachUser = this.renderEachUser.bind(this);
    }

    // Get full information of user from list of threadUsers _id
    getMeteorData() {
      let user_list = [];
      if (this.props.threadUsers) {
        user_list = this.props.threadUsers;
      }
      let users = Meteor.users.find({_id: {$in: user_list}}).fetch();          
      return {
        users: users,
      }
    }

    shouldComponentUpdate(nextProps) {
      const same_users = _.isEqual(this.props.threadUsers, nextProps.threadUsers);
      const same_list = _.isEqual(this.props.userBlackList, nextProps.userBlackList);
      if (same_users && same_list) {
        return false;
      } else {
        return true;        
      }
    }
    
    render() {
      let user_list = this.data.users.map((user, index) => this.renderEachUser(user, index));
      let selectItems = [
        { payload: true, text: "All"},
        { payload: false, text: "None"}
      ];
      return (
        <div style={ComponentStyle.wrapper}>
          <div>
            <p><span style={ComponentStyle.text}>Select:</span>
              <FlatButton label="All" style={ComponentStyle.button} onClick={this.makeSelection.bind(null, true)}/><FlatButton label="None" style={ComponentStyle.button} onClick={this.makeSelection.bind(null, false)}/></p>
          </div>
          <List subheader="Users in thread">
            {user_list}
          </List>
        </div>
      )
    }

    renderEachUser(user, index) {
      let avatar = <Avatar onClick={this.linkToUserPost.bind(null, user._id)}>{user.username[0]}</Avatar>;
      if (user.profile) {
        if (user.profile.avatar) {
          <Avatar src={user.profile.avatar} onClick={this.linkToUserPost.bind(null, user._id)} />;
        }
      }
      let checked = true;
      if (Immutable.fromJS(this.props.userBlackList).find(x => x === user._id)) {
        checked = false;
      }
      return (
        <ListItem
            key={user._id}
            leftAvatar={avatar}
            primaryText={user.username}
            rightIconButton={ <Checkbox style={ComponentStyle.checkBox}
                                        defaultChecked={checked}
                                        onCheck={this.filterUser.bind(null, user._id)}/>}>
        </ListItem>
      )
    }

    linkToUserPost(id) {
      this.props.onUser.bind(null, id)();
    }

    filterUser(id, event, checked) {
      if (checked == false) {
        let newList = Immutable.fromJS(this.props.userBlackList).concat(Immutable.fromJS(id)).toJS();
        this.props.updateBlackList.bind(null, newList)();
      } else {
        let newList = Immutable.fromJS(this.props.userBlackList).filter(x => x !== id).toJS();
        this.props.updateBlackList.bind(null, newList)();      
      }
    }

    makeSelection(value) {
      if (value == true) {
        this.props.updateBlackList.bind(null, [])();
      } else {
        if (this.data.users) {
          let user_list = Immutable.fromJS(this.data.users).map(x => x.get('_id')).toJS();
          this.props.updateBlackList.bind(null, user_list)();
        }
      }
    }
  };

