import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
// Components
import { List, ListItem, Checkbox, FlatButton, Styles, Avatar } from 'material-ui';
import ComponentStyle from '../../styles/right/thread_users';
const {Colors} = Styles;

/**
* ThreadUsers component
* Render on the right side in 'large' screen
* Render in RightNav in 'small' and 'medium' screen
* Click on user avatar navigate to '/forum/user/:id'
* Use to filter user to hide or show their comments in thread
*/
@ReactMixin.decorate(ReactMeteorData)
  export default class ThreadUsers extends Component {
    static propTypes = {
      threadUsers: PropTypes.arrayOf(PropTypes.string),     // When user signed in
      blacklist: PropTypes.arrayOf(PropTypes.string),       // List of users which you don't want to see
      blacklistUser: PropTypes.func.isRequired,
      whitelistUser: PropTypes.func.isRequired,
      blacklistAll: PropTypes.func.isRequired,
      whitelistAll: PropTypes.func.isRequired,
      onUser: PropTypes.func.isRequired
    };

    static defaultProps = {
      threadUsers: [],
      blacklist: []
    };
    
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

    componentWillMount() {
      this.threadUsersHandler = Meteor.subscribe('thread-users');
    }

    // Get full information of user from list of threadUsers _id
    // Use meteor data for convenience
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

    componentWillUnmount() {
      this.threadUsersHandler.stop();
    }

    shouldComponentUpdate(nextProps) {
      const same_users = _.isEqual(this.props.threadUsers, nextProps.threadUsers);
      const same_list = _.isEqual(this.props.blacklist, nextProps.blacklist);
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
          <div style={ComponentStyle.selectDiv}>
            <p><span style={ComponentStyle.text}>Select:</span><span style={ComponentStyle.selectButtons}>
              <FlatButton label="All" style={ComponentStyle.button} onClick={this.makeSelection.bind(null, true)}/>
              <FlatButton label="None" style={ComponentStyle.button} onClick={this.makeSelection.bind(null, false)}/>
            </span></p>
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
          avatar = <Avatar src={user.profile.avatar} onClick={this.linkToUserPost.bind(null, user._id)} />;
        }
      }
      let checked = true;
      if (_.find(this.props.blacklist, usr => usr === user._id)) {
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

    // @params id {string} - userId
    linkToUserPost(id) {
      this.props.onUser.bind(null, id)();
    }

    // @params id {string} - userId
    // @params event {object} - synthetic event
    // @params checked {boolean}
    filterUser(id, event, checked) {
      if (checked == false) {
        this.props.blacklistUser(id);
      } else {
        this.props.whitelistUser(id);
      }
    }

    // @params value {boolean}
    makeSelection(value) {
      if (value == true) {
        this.props.whitelistAll();
      } else {
        this.props.blacklistAll(this.props.threadUsers);
      }
    }
  };

