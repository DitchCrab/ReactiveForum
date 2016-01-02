import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Featured from './featured';
import Thread from './thread';
import ThreadCarousel from './thread_carousel';
import ComponentStyle from 'forum/client/styles/thread/wrapper';
import Immutable from 'immutable';

export default class Wrapper extends Component {

  static propTypes = {
    // LIst of users that are filtered
    userBlackList: PropTypes.arrayOf(PropTypes.string),
    // Featured threads OR threads contributed by user
    mainThreads: PropTypes.arrayOf(PropTypes.object),
    // Current Thread
    thread: PropTypes.object,
    // If user signed in
    currentUser: PropTypes.object,
    // List of thread viewed so far
    threadList: PropTypes.arrayOf(PropTypes.object),
    // If view threads contributed by user, pass user _id
    onUser: PropTypes.string,
    // Callbacks
    viewThread: PropTypes.func,
    updateThreadList: PropTypes.func,
    windowSize: PropTypes.string,
  }

  static defaultProps = {
    userBlackList: []
  }

  constructor(props, context) {
    super(props);
    this.state = {
      viewingCarousel: false,
      // Naive identify if thread has new comment
      newMessages: 0
    };
    this.toggleCarousel = this.toggleCarousel.bind(this);
    this.closeCarousel = this.closeCarousel.bind(this);
  }

  // Idenfity if current thread has new comment
  componentWillReceiveProps(nextProps) {
    var id;
    if (this.props.currentUser) {
      id = this.props.currentUser._id;
    }
    if (nextProps.thread && this.props.thread) {
      if (nextProps.thread._id === this.props.thread._id && nextProps.thread.comments.length > this.props.thread.comments.length) {
        if (nextProps.thread.comments[nextProps.thread.comments.length - 1].userId !== id) {
          this.setState({newMessages: this.state.newMessages + 1});
        }
      }
    }
  }

  // Automatically scroll to the end on receive new comments in thread
  componentWillUpdate() {
    if (this.props.windowSize === 'small') {
      let node = window.document.body;
      this.shouldScrollBottom= (node.scrollTop + node.offsetHeight) >= node.scrollHeight;
    } else {
      let node = ReactDOM.findDOMNode(this);
      this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) >= node.scrollHeight;        
    }
  }

  // Automatically scroll to the end on receive new comments in thread
  componentDidUpdate() {
    if (this.props.windowSize === 'small') {
      var node = window.document.body;
    } else {
      var node = ReactDOM.findDOMNode(this);
    }
    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const thread_props = {
      updateThreadList: this.props.updateThreadList.bind(null),
      threadList: this.props.threadList,
      currentUser: this.props.currentUser,
      thread: this.props.thread,
      toggleCarousel: this.toggleCarousel,
      viewingCarousel: this.state.viewingCarousel,
      userBlackList: this.props.userBlackList,
      newMessages: this.state.newMessages,
      windowSize: this.props.windowSize
    };
    const featured_props = {
      viewThread: this.props.viewThread.bind(null),
      threads: this.props.mainThreads,
      onUser: this.props.onUser,
    };
    const thread_carousel_props = {
      onClickOutside: this.closeCarousel,
      threadList: this.props.threadList,
      viewThread: this.props.viewThread.bind(null),
      windowSize: this.props.windowSize
    };
    return (
      <div style={ComponentStyle.wrapper(this.props.windowSize)} className="thread-wrapper">
        { this.props.thread ? <Thread {...thread_props}/> : <Featured {...featured_props} /> }
        {this.state.viewingCarousel ? <ThreadCarousel {...thread_carousel_props}/> : null }
      </div>
    );
  }

  toggleCarousel() {
    this.setState({viewingCarousel: !this.state.viewingCarousel});
  }

  closeCarousel() {
    this.setState({viewingCarousel: false});
  }

};
