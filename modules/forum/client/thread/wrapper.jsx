import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import Featured from './featured';
import Thread from './thread';
import ThreadCarousel from './thread_carousel';
import { Snackbar } from 'material-ui';
import Immutable from 'immutable';
import Threads from 'forum/collections/threads';

@ReactMixin.decorate(ReactMeteorData)
export default class Wrapper extends Component {
  constructor(props, context) {
    super(props);
    this.state = {showSnack: false, viewingCarousel: false, threadList: [], notSeenUser: []};
    this.radian = this.radian.bind(this);
    this.viewingThread = this.viewingThread.bind(this);
    this.toggleCarousel = this.toggleCarousel.bind(this);
    this.closeCarousel = this.closeCarousel.bind(this);
    this.viewMessage = this.viewMessage.bind(this);
  }

  getMeteorData() {
    //Get threads of particular user
    let threads = [];
    let onGeneralUser = this.state.onGeneralUser;          
    if (onGeneralUser) {
      let threads_1 = Threads.find({"user._id": onGeneralUser}).fetch();
      let threads_2 = Threads.find({comments: {$elemMatch: {userId: onGeneralUser}}}).fetch();
      threads = _.uniq(_.union(threads_1, threads_2), (thread) => { return thread._id; });
    } else {
      threads = Threads.find().fetch();                
    }
    //Get thread when user click on particular thread on menu or carousel
    let thread = Threads.findOne({_id: this.state.viewThread});
    let imThread = Immutable.fromJS(thread);
    let imOldThread = Immutable.fromJS(this.data.thread);
    if (!Immutable.is(imThread, imOldThread)) {
      //Notify user if there is new message on her current thread
      if (this.data.thread && (thread._id == this.data.thread._id)) {
        if (thread.comments.length > this.data.thread.comments.length && !Session.get("iJustComment")) {
          this.refs.snackbar.show();
        }
        Session.set("iJustComment", null);
      }
      let threadList = Immutable.fromJS(this.state.threadList);
      if (threadList) {
        let found = threadList.find(x => { return x.get("_id") === thread._id});
        // Add to carousel list if thread is not added
        if (!found) {
          var newThreadList = threadList.push(Immutable.fromJS(thread)).toJS();
          Session.set('threadList', newThreadList);
        }
      }
      // Compute list of user on thread
      let userList = [];
      if (imThread.get('comments')) {
        userList = imThread.get('comments').map(x => x.get('userId')).toJS();        
      }
      Session.set('userList', userList);
    }

    return {
      threads: threads,
      thread: thread,
      user: Meteor.user(),
    }
  }

  componentWillMount() {
    Tracker.autorun(() => {
      this.setState({onGeneralUser: Session.get("onGeneralUser")});
      this.setState({viewThread: Session.get('viewThread')});
      if (Session.get('threadList')) {
        this.setState({threadList: Session.get('threadList')});        
      }
      if (Session.get('notSeenUser')) {
        let not_users = Immutable.fromJS(this.state.notSeenUser);
        let new_not_users = Immutable.fromJS(Session.get('notSeenUser'));
        if (!Immutable.is(not_users, new_not_users)) {
          if (new_not_users) {
            this.setState({notSeenUser: new_not_users.toJS()});            
          } else {
            this.setState({notSeenUser: []});
          }
        }
      }
    })
  }

  componentDidMount() {
    this.setState({viewThread: Session.get('viewThread')});
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
        { this.viewingThread() ? <Thread currentUser={this.data.user} thread={this.data.thread} toggleCarousel={this.toggleCarousel} viewingCarousel={this.state.viewingCarousel} notSeenUser={this.state.notSeenUser}/> : <Featured  viewThread={this.props.viewThread.bind(null)} threads={this.data.threads} /> }
        <Snackbar
            ref="snackbar"
            message="New Messages"
            action="view"
            autoHideDuration={3000}
            onActionTouchTap={this.viewMessage}/>
        {this.state.viewingCarousel ? <ThreadCarousel onClickOutside={this.closeCarousel} threadList={this.state.threadList} viewThread={this.props.viewThread.bind(null)}/> : null }
      </div>
    );
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

  viewingThread() {
    if (this.data.thread) {
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

Wrapper.propTypes = {
  viewThread: PropTypes.func
}
