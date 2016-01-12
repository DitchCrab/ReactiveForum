import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Threads from 'forum/collections/threads';
import * as UserThreadsActions from 'forum/client/actions/user_threads';
import * as UserActions from 'forum/client/actions/user';
import { bindActionCreators } from 'redux';
import { pushPath } from 'redux-simple-router';
import ThreadList from './thread_list';
import ComponentStyle from 'forum/client/styles/thread/user';

export default class User extends Component {
  static propTypes = {
    // List of threads contributed by user
    userThreads: PropTypes.arrayOf(PropTypes.object),
    onUser: PropTypes.object
  };

  static defaultProps = {
    userThreads: []
  };

  constructor(props, context) {
    super(props);
    this.viewThread = this.viewThread.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.onUserDict.set('id', nextProps.params.id);
    }
  }

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

  componentWillUnmount() {
    this.threadsTracker.stop();
    delete ReactiveDict._dictsToMigrate.onUser;
  }

  render() {
    return (
      <div style={ComponentStyle.wrapper}>
        <h1 style={ComponentStyle.header}>{this.props.onUser ? this.props.onUser.username : null} contributed to: </h1>
        <ThreadList threads={this.props.userThreads} viewThread={this.viewThread} />
      </div>
    )
  }

  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`)
  }

}

function mapStateToProps(state) {
  return {
    windowSize: state.windowSize,
    onUser: state.onUser,
    userThreads: state.userThreads
  }
}

const actions = _.extend(UserThreadsActions, UserActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(User);
