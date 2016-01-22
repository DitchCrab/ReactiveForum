import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// Components
import Helmet from 'react-helmet';
import ComponentStyle from 'forum/client/styles/center/lists/featured';
import ThreadList from './thread_list';
// Collections
import Threads from 'forum/collections/threads';
// Redux actions
import { FeaturesActions } from 'forum/client/actions';
import { bindActionCreators } from 'redux';
import { pushPath } from 'redux-simple-router';

export class Featured extends Component {
  static propTypes = {
    // List of threads queried
    featuredThreads: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    featuredThreads: []
  };

  constructor(props, context) {
    super(props);
    this.viewThread = this.viewThread.bind(this);
  }

  componentWillMount() {
    let threads = Threads.find({}, {sort: {likes: -1}, limit: 20}).fetch();
    this.props.actions.getFeaturedThreads(threads);
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
    const description = 'Open forum - Featured threads';
    const img = this.props.featuredThreads[0] ? this.props.featuredThreads[0].imgUrl : 'bg_img';
    const domain = 'http://mydomain.com';
    const url = `${domain}/forum`;
    const meta = [
      {name: 'description', content: description},
      {name: 'keywords', content: 'crab, featured'},
      {charset: 'UFT-8'},
      //Open graph
      {property: 'og:title', content: 'Forum'},
      {property: 'og:type', content: 'features'},
      {property: 'og:url', content: url},
      {property: 'og:image', content: img},
      {property: 'og:description', content: description},
      {property: 'og:site_name', content: 'My website'},
      //Twitter
      {name: 'twitter:card', content: img},
      {name: 'twitter:site', content: url},
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

