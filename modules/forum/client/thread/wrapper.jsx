import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Featured from './featured';
import Thread from './thread';
import ThreadCarousel from './thread_carousel';
import { Snackbar } from 'material-ui';
import Immutable from 'immutable';

export default class Wrapper extends Component {

  static propTypes = {
    viewThread: PropTypes.func
  }

  constructor(props, context) {
    super(props);
    this.state = {showSnack: false, viewingCarousel: false};
    this.radian = this.radian.bind(this);
    this.viewingThread = this.viewingThread.bind(this);
    this.toggleCarousel = this.toggleCarousel.bind(this);
    this.closeCarousel = this.closeCarousel.bind(this);
    this.viewMessage = this.viewMessage.bind(this);
  }

  componentDidMount() {
    if (this.props.thread) {
      const found = _.find(this.props.threadList, (thread) => { return thread._id === this.props.thread});
      if (!found) {
        this.props.updateThreadList(this.props.thread);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.thread && this.props.thread) {
      if (nextProps.thread._id === this.props.thread._id && nextProps.thread.comments.length > this.props.thread.comments.length) {
        this.refs.snackbar.show();        
      }
    }
  }

  componentWillUpdate() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w_w <= 640) {
      let node = window.document.body;
      this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) >= node.scrollHeight;
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
    return (
      <div style={wrapper_style} className="thread-wrapper">
        { this.viewingThread() ? <Thread currentUser={this.props.currentUser} thread={this.props.thread} toggleCarousel={this.toggleCarousel} viewingCarousel={this.state.viewingCarousel} notSeenUser={this.props.userBlackList}/> : <Featured  viewThread={this.props.viewThread.bind(null)} threads={this.props.mainThreads} /> }
        <Snackbar
            ref="snackbar"
            message="New Messages"
            action="view"
            autoHideDuration={3000}
            onActionTouchTap={this.viewMessage}/>
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

  viewMessage() {
    
  }
  
  radian(arg1, arg2) {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
    var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
    if (isOpera) {
      return `-o-linear-gradient(${arg1}, ${arg2})`;
    } else if (isFirefox) {
      return `-moz-linear-gradient($(arg1), ${arg2})`;
    } else if (isSafari) {
      return `-webkit-linear-gradient(${arg1}, ${arg2})`;
    } else {
      return `linear-gradient(${arg1}, ${arg2})`;
    }
  }
};
