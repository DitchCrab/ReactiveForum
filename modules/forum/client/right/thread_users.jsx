import { Component } from 'react';
import ReactMixin from 'react-mixin';
import { List, ListItem, Checkbox, FlatButton, Styles } from 'material-ui';
import Immutable from 'immutable';
const {Colors} = Styles;

@ReactMixin.decorate(ReactMeteorData)
export default class ThreadUsers extends Component {
  constructor(props, context) {
    super(props);
    this.state = {showRequestDialog: false, notSeenUser: [], userList: []};
    this.linkToUserPost = this.linkToUserPost.bind(this);
    this.filterUser = this.filterUser.bind(this);
    this.makeSelection = this.makeSelection.bind(this);
  }

  getMeteorData() {
    let users = [];
    if (this.state.userList) {
      users = Meteor.users.find({_id: {$in: this.state.userList}}).fetch();      
    }
    return {
      user: Meteor.user(),
      users: users,  
    }
  }
  
  componentWillMount() {
    Tracker.autorun(() => {
      if (!Immutable.is(Immutable.fromJS(Session.get('userList')), Immutable.fromJS(this.state.userList))) {
        this.setState({userList: Session.get('userList')});
      }
      if (Session.get('notSeenUser')) {
        this.setState({'notSeenUser': Session.get('notSeenUser')});
      }
    })  
  }

  render() {
    var userId;
    if (this.data.user) {
      userId = this.data.user._id;
    }
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
    const wrapper_style = {
      height: `${w_h}px`
    };
    let user_list = this.data.users.map((user, index) => {
      let avatar = "avatar.png";
      if (user.profile) {
        if (user.profile.avatar) {
          avatar = user.profile.avatar            
        }
      }
      let checked = true;
      if (Immutable.fromJS(this.state.notSeenUser).find(x => x === user._id)) {
        checked = false;
      }
      return (
        <ListItem
            key={user._id}
            leftAvatar={<Avatar src={avatar} onClick={this.linkToUserPost.bind(null, user._id)} />}
                                primaryText={user.username}
                                rightIconButton={ <Checkbox style={{width: 30, paddingTop: 10}}
                                                            defaultChecked={checked}
                                                            onCheck={this.filterUser.bind(null, user._id)}/>}>
        </ListItem>
      )
    });
    let selectItems = [
      { payload: true, text: "All"},
      { payload: false, text: "None"}
    ]
    return (
      <div className="s-grid-top" style={wrapper_style}>
        <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-top">
          <div>
            <p><span style={{fontSize: '80%'}} color={Colors.grey}>Select:</span>
              <FlatButton label="All" style={{minWidth: 50}} onClick={this.makeSelection.bind(null, true)}/><FlatButton label="None" style={{minWidth: 50}} onClick={this.makeSelection.bind(null, false)}/></p>
          </div>
          <List subheader="Today">
            {user_list}
          </List>
        </div>
        <div style={{position: "fixed", right: "15px", bottom: "10px"}}>
          <FlatButton label="Guru" primary={true} />
          <FlatButton label="Friends" secondary={true} />
        </div>
      </div>
    )
  }

  linkToUserPost(id) {
    this.props.onGeneralUser.bind(null, id)();
  }

  filterUser(id, event, checked) {
    if (checked == false) {
      let newList = Immutable.fromJS(this.state.notSeenUser).concat(Immutable.fromJS(id)).toJS();
      Session.set('notSeenUser', newList);
    } else {
      let newList = Immutable.fromJS(this.state.notSeenUser).filter(x => x !== id).toJS();
      Session.set('notSeenUser', newList);
    }
  }

  makeSelection(value) {
    if (value == true) {
      Session.set('notSeenUser', []);
    } else {
      if (this.data.users) {
        let user_list = Immutable.fromJS(this.data.users).map(x => x.get('_id')).toJS();
        Session.set('notSeenUser', user_list);
      }
    }
  }
}
