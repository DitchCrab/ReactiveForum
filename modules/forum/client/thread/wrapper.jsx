import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Featured from './featured';
import Thread from './thread';
import ThreadCarousel from './thread_carousel';
import Immutable from 'immutable';

export default class Wrapper extends Component {

  static propTypes = {
    viewThread: PropTypes.func,
    userBlackList: PropTypes.arrayOf(PropTypes.string),
    mainThreads: PropTypes.arrayOf(PropTypes.object),
    thread: PropTypes.object,
    currentUser: PropTypes.object,
    category: PropTypes.arrayOf(PropTypes.object),
    threadList: PropTypes.arrayOf(PropTypes.object),
    updateThreadList: PropTypes.func,
    onUser: PropTypes.string
  }

  static defaultProps = {
    userBlackList: []
  }

  constructor(props, context) {
    super(props);
    this.state = {
      viewingCarousel: false,
      newMessages: 0
    };
    this.viewingThread = this.viewingThread.bind(this);
    this.toggleCarousel = this.toggleCarousel.bind(this);
    this.closeCarousel = this.closeCarousel.bind(this);
  }

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

  componentWillUpdate() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w_w <= 640) {
      let node = window.document.body;
      this.shouldScrollBottom= (node.scrollTop + node.offsetHeight) >= node.scrollHeight;
    } else {
      let node = ReactDOM.findDOMNode(this);
      this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) >= node.scrollHeight;        
    }
  }

  componentDidUpdate() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w_w <= 640) {
      var node = window.document.body;
    } else {
      var node = ReactDOM.findDOMNode(this);
    }
    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 60;
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const wrapper_style = {
      height: `${w_h}px`,
      overflowY: w_w > 640 ? "auto" : "none",
      margin: 0
    };
    const thread_props = {
      updateThreadList: this.props.updateThreadList.bind(null),
      threadList: this.props.threadList,
      currentUser: this.props.currentUser,
      thread: this.props.thread,
      toggleCarousel: this.toggleCarousel,
      viewingCarousel: this.state.viewingCarousel,
      notSeenUser: this.props.userBlackList,
      newMessages: this.state.newMessages
    };
    return (
      <div style={wrapper_style} className="thread-wrapper">
        { this.viewingThread() ? <Thread {...thread_props}/> : <Featured  viewThread={this.props.viewThread.bind(null)} threads={this.props.mainThreads} onUser={this.props.onUser}/> }
        {this.state.viewingCarousel ? <ThreadCarousel onClickOutside={this.closeCarousel} threadList={this.props.threadList} viewThread={this.props.viewThread.bind(null)}/> : null }
      </div>
    );
  }

  viewingThread() {
    if (this.props.thread) {
      return true;
    } else {
      return false;
    } 
  }

  toggleCarousel() {
    this.setState({viewingCarousel: !this.state.viewingCarousel});
  }

  closeCarousel() {
    this.setState({viewingCarousel: false});
  }

};
