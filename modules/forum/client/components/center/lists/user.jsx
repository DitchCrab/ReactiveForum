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

export class User extends Component {
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

  componentWillMount() {
    let user = Meteor.users.findOne({_id: this.props.params.id});
    this.props.actions.getUser(user);
    let own_threads = Threads.find({'user._id': this.props.params.id}).fetch();
    let in_threads = Threads.find({comments: {$elemMatch: {userId: this.props.params.id}}}).fetch();
    let threads = _.uniq(_.union(own_threads, in_threads), thread => thread._id);
    this.props.actions.getUserThreads(threads);
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

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.onUserDict.set('id', nextProps.params.id);
    }
  }

  render() {
    const username = this.props.onUser ? this.props.onUser.username : null;
    const description = `Forum - Threads ${username} contributed to`;
    const img = this.props.userThreads[0] ? this.props.userThreads[0].imgUrl : 'bg_img';
    const meta = [
      {name: 'description', content: description},
      {name: 'keywords', content: 'crab, user'},
      {charset: 'UFT-8'},
      //Open graph
      {property: 'og:title', content: 'Forum'},
      {property: 'og:type', content: 'lists'},
      {property: 'og:url', content: 'my url'},
      {property: 'og:image', content: img},
      {property: 'og:description', content: description},
      {property: 'og:site_name', content: 'My website'},
      //Twitter
      {name: 'twitter:card', content: img},
      {name: 'twitter:site', content: '@twitter_url'},
      {name: 'twitter:title', content: 'Forum'},
      {name: 'twitter:description', content: description},
      {name: 'twitter:image:src', content: img},
      // Google plus
      {itemprop: 'name', content: 'Forum'},
      {itemprop: 'description', content: description},
      {itemprop: 'image', content: img}
    ];
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

  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`)
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
