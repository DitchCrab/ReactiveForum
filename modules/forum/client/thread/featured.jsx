import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Threads from 'forum/collections/threads';
import * as FeaturesActions from 'forum/client/actions/features';
import { bindActionCreators } from 'redux';
import { pushPath } from 'redux-simple-router';
import ComponentStyle from 'forum/client/styles/thread/featured';
import ThreadList from './thread_list';

export default class Featured extends Component {
  static propTypes = {
    // List of threads queried
    featuredThreads: PropTypes.arrayOf(PropTypes.object),
    // Pass on when queried threads by particular user
    viewUser: PropTypes.object
  };

  static defaultProps = {
    featuredThreads: []
  };

  constructor(props, context) {
    super(props);
    this.viewThread = this.viewThread.bind(this);
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      let threads = Threads.find({}, {sort: {likes: -1}, limit: 20}).fetch();
      this.props.actions.getFeaturedThreads(threads);
    })
  }

  componentWillUnmount() {
    this.tracker.stop();
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.featuredThreads, nextProps.featuredThreads);
  }

  render() {
    return (
      <div style={ComponentStyle.wrapper}>
        <h1 style={ComponentStyle.header}>Features: </h1>
        <ThreadList threads={this.props.featuredThreads} viewThread={this.viewThread} />
      </div>
    )
  }

  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`)
  }
}

function mapStateToProps(state) {
  return {
    featuredThreads: state.featuredThreads,
  }
}

const actions = _.extend(FeaturesActions, {pushPath: pushPath});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Featured);
