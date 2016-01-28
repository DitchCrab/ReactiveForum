import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//Components
import Helmet from 'react-helmet';
import ThreadList from './thread_list';
import ComponentStyle from 'forum/client/styles/center/lists/user';
// Collections
import Threads from 'forum/collections/threads';
// Redux actions
import {
  UserThreadsActions,
  UserActions
} from 'forum/client/actions';
import { bindActionCreators } from 'redux';
import { pushPath } from 'redux-simple-router';
//Helpers
import Meta from 'forum/client/meta';

/**
* User component
* Wrapper for path 'forum/user/:id'
* Responsible for fetching the right data and update redux state
*/
export class User extends Component {
  static propTypes = {
    userThreads: PropTypes.arrayOf(PropTypes.object), // Threads created or commended by user
    onUser: PropTypes.object, // User object
    actions: PropTypes.shape({
      getUser: PropTypes.func,
      getUserThreads: PropTypes.func,
      pushPath: PropTypes.func
    })
  };

  static defaultProps = {
    userThreads: [],
    onUser: {}
  };

  constructor(props, context) {
    super(props);
    this.viewThread = this.viewThread.bind(this);
  }

  // Server side fetching
  componentWillMount() {
    let user = Meteor.users.findOne({_id: this.props.params.id});
    this.props.actions.getUser(user);
    let own_threads = Threads.find({'user._id': this.props.params.id}).fetch();
    let in_threads = Threads.find({comments: {$elemMatch: {userId: this.props.params.id}}}).fetch();
    let threads = _.uniq(_.union(own_threads, in_threads), thread => thread._id);
    this.props.actions.getUserThreads(threads);
  }

  // Reactive clientside fetching
  componentDidMount() {
    this.onUserDict = new ReactiveDict('onUser');
    this.onUserDict.set('id', this.props.params.id);
    this.userTracker = Tracker.autorun(() => {
      let user = Meteor.users.findOne({_id: this.onUserDict.get('id')});
      this.props.actions.getUser(user);
    });
    this.threadsTracker = Tracker.autorun(() => {
      let own_threads = Threads.find({'user._id': this.onUserDict.get('id')}).fetch();
      let in_threads = Threads.find({comments: {$elemMatch: {userId: this.onUserDict.get('id')}}}).fetch();
      let threads = _.uniq(_.union(own_threads, in_threads), thread => thread._id);
      this.props.actions.getUserThreads(threads);
    })
  }

  // Unregister memory
  componentWillUnmount() {
    this.threadsTracker.stop();
    delete ReactiveDict._dictsToMigrate.onUser;
  }

  // Change id of user to trigger change in autorun
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.onUserDict.set('id', nextProps.params.id);
    }
  }

  render() {
    const username = this.props.onUser ? this.props.onUser.username : null;
    const userId = this.props.onUser ? this.props.onUser._id : null;
    // Meta settings
    const description = `Forum - Threads ${username} contributed to`;
    const img = this.props.userThreads[0] ? this.props.userThreads[0].imgUrl : 'bg_img';
    const path = `/forum/user/${userId}`;
    const meta = Meta(path, description, img);
    return (
      <div style={ComponentStyle.wrapper}>
        <Helmet
            title={description}
            meta={meta}
        />
        <h1 style={ComponentStyle.header}>{username} contributed to: </h1>
        <ThreadList threads={this.props.userThreads} viewThread={this.viewThread} />
      </div>
    )
  }

  // @params id {string} - threadId
  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`);
  }

}

function mapStateToProps(state) {
  return {
    onUser: state.onUser,
    userThreads: state.userThreads
  }
}

const actions = _.extend(UserThreadsActions, UserActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(User);
