import { Component, PropTypes} from 'react';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import Dialog from 'material-ui/lib/dialog';
import Wrapper from './thread/wrapper';
import LeftWrapper from './left/left_wrapper';
import ThreadUsers from './right/thread_users';
import ThreadForm from './widgets/thread_form';
import FeaturedUsers from './right/featured_users';
import moment from 'moment';
import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';
import { FlatButton, LeftNav, Styles } from 'material-ui';
import Layout from 'forum/client/styles/layout';
import ComponentStyle from 'forum/client/styles/main';
const { AutoPrefix } = Styles;
import * as BrowsingActions from './actions/browsing';
import * as CategoriesActions from './actions/categories';
import * as FeaturesActions from './actions/features';
import * as ThreadActions from './actions/thread';
import * as UserActions from './actions/user';
import * as UserThreadsActions from './actions/user_threads';
import * as BlacklistActions from './actions/blacklist';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

@ReactMixin.decorate(ReactMeteorData)
export default class Main extends Component {
    
  static contextTypes = {
    history: PropTypes.object.isRequired    
  };

  static propTypes = {
    // React router params
    params: PropTypes.object,
    // Callback to set which section to view for small screen of ['thread', 'browsing']
    viewSection: PropTypes.func,
    // SideNav state and callback
    openSideNav: PropTypes.bool,
    closeSideNav: PropTypes.func,
    // User signed in object
    currentUser: PropTypes.object,
    // 'small', 'medium' or 'large' size
    windowSize: PropTypes.string
  };

  static defaultProps = {
    section: 'browsing'
  };
  
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {
      // New thread form dialog
      showDialog: false,
      // Store threads which user visited for browsing in 'Carousel'
      threadList: [],
      // Filtering user when viewing threads
      userBlackList: [],
    };
    // Callback on click on specific thread card
    this.viewThread = this.viewThread.bind(this);
    // Rendering methods decoupling from main render method
    this.renderMain = this.renderMain.bind(this);
    this.renderBrowsing = this.renderBrowsing.bind(this);
    this.renderUserList = this.renderUserList.bind(this);
    // Fire when click on particular user avatar.
    // Result in querying and rendering list of threads which user contributed to
    this.setUser = this.setUser.bind(this);
    // Fab button which is used to open New Thread Form dialog
    // Only available when user signed in
    this.renderNewThread = this.renderNewThread.bind(this);
    // Manipulating New Thread Dialog
    this._openDialog = this._openDialog.bind(this);      
    this._closeDialog = this._closeDialog.bind(this);
    this._cancelForm = this._cancelForm.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this.clearNewThreadState = this.clearNewThreadState.bind(this);
    this.resetSubmitState = this.resetSubmitState.bind(this);
    // Currently only add new thread to carousel
    // Todo: remove thread from carousel
    this.updateThreadList = this.updateThreadList.bind(this);
  }

  getMeteorData() {
    var viewUser;
    // User's threads or featured threads (main view)
    if (this.state.onUser) {
      let user_thread_handler = Meteor.subscribe('user-threads', this.state.onUser);
      let threads_1 = Threads.find({"user._id": this.state.onUser}).fetch();
      let threads_2 = Threads.find({comments: {$elemMatch: {userId: this.state.onUser}}}).fetch();
      viewUser = Meteor.users.findOne({_id: this.state.onUser});
      var mainThreads = _.uniq(_.union(threads_1, threads_2), (thread) => { return thread._id; });      
    } else {
      let featured_thread_handler = Meteor.subscribe('featured-threads');
      var mainThreads = Threads.find({}, {sort: {likes: -1}, limit: 10}).fetch();                
    }

    //Viewing thread (main view)
    let threadId = this.props.params.thread;
    let view_thread_handler = Meteor.subscribe('viewing-threads', threadId);
    var viewThread;
    if (threadId) {
      viewThread = Threads.findOne({_id: threadId});          
    }
    
    return {
      mainThreads: mainThreads,
      viewThread: viewThread,
      viewUser: viewUser
    }
  }

  componentWillMount() {
    this.browsingHandler = Meteor.subscribe('browsing-threads');
    this.imgHandler = Meteor.subscribe('threadImgs');
    this.avatarHandler = Meteor.subscribe('userAvatars');
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.browsingLimit !== nextProps.browsingLimit) {
      this.browsingDict.set('limit', nextProps.browsingLimit);
    }
    if (this.props.browsingQuery !== nextProps.browsingQuery) {
      this.browsingDict.set('query', nextProps.browsingQuery);
    }
  }

  componentDidMount() {
    // Get initial categories without watching changes
    this.props.actions.getInitialCategories();
    // Get browsing and watch changes
    this.browsingDict = new ReactiveDict('browsing');
    this.browsingDict.set('limit', this.props.browsingLimit);
    this.browsingDict.set('query', this.props.browsingQuery);
    // Rendering the right view based on url
    if (this.props.params.thread) {
      this.props.viewSection.bind(null, 'thread')();
    }

    this.browsingTracker = Tracker.autorun(() => {
      let threads = Threads.find(this.browsingDict.get('query'), {sort: {createdAt: -1}, limit: this.browsingDict.get('limit')}).fetch();
      if (threads.length < 1) {
        this.props.actions.setSearchErr('Sorry, no thread found');
      }
      if (!_.isEqual(threads, this.props.browsingThreads)) {
        this.props.actions.getBrowsingThreads(threads);
        if (this.browsingDict.get('limit') <= threads.length) {
          this.props.actions.setHasMoreBrowsing(true);
        }
      }
    })
  }

  componentWillUnmount() {
    this.browsingHandler.stop();
    this.imgHandler.stop();
    this.avatarHandler.stop();
    this.browsingTracker.stop();
    delete ReactiveDict._dictsToMigrate.browsing;
  }

  render() {
    let browsing = this.renderBrowsing();
    let filter_user = this.renderUserList();
    // As defined in MaterialUI as LeftNav
    // Only show in small and medium screen
    // Include FeaturedUsers at homepage AND UserList at thread page
    const right_nav_props = {
      open: this.props.openSideNav,
      docked: false,
      onRequestChange: this.props.closeSideNav,
      disableSwipeToOpen: true,
      openRight: true,
    };
    // Render based on screen size
    switch (this.props.windowSize) {
      case 'small':
        return (
          <section style={AutoPrefix.all(Layout.section)}>        
            { this.props.section === 'browsing' ? browsing : null }
            { this.props.section === 'thread' ? this.renderMain() : null }
            <LeftNav ref="rightNav" {...right_nav_props}>
              {filter_user}
            </LeftNav>
            { this.props.currentUser ? this.renderNewThread() : null }
          </section>
        );
        break;
      case 'medium':
        return (
          <section style={Layout.section}>        
            {browsing}
            {this.renderMain()}
            <LeftNav ref="rightNav" {...right_nav_props}>
              {filter_user}
            </LeftNav>
            { this.props.currentUser ? this.renderNewThread() : null }
          </section>
        );
        break;
      case 'large':
        return (
          <section style={Layout.section}>
            { browsing }
            {this.renderMain()}
            {filter_user}
            { this.props.currentUser ? this.renderNewThread() : null }
          </section>
        );
        break;
    }
  }

  // Main view:
  // Has featured on homepage
  // Has list of threads contributed by user if clicked on user avatar on right nav
  // Has Thread on viewing thread
  renderMain() {
    return (
      <div style={Layout.mainThread(this.props.windowSize)}>
        <div style={ComponentStyle.mainWrapper(this.props.windowSize)}>
          {this.props.children}
        </div>
      </div>
      )
  }

  // Include search, category selection and list of threads
  // On small screen: render if 'section' is 'browsing'
  // On medium and large screen: render as right nav
  renderBrowsing() {
    const left_wrapper_props = {
      resetSearch: this.resetSearch,
      threads: this.props.browsingThreads,
      categories: this.props.categories,
      currentUser: this.props.currentUser,
      onSelectCategory: this.selectCategory,
      onSearch: this.searchThreads,
      viewThread: this.viewThread,
      windowSize: this.props.windowSize,
      openNewThreadDialog: this._openDialog,
      hasMoreBrowsing: this.props.hasMoreBrowsing,
      browsingLimit: this.props.browsingLimit,
      setHasMoreBrowsing: this.props.actions.setHasMoreBrowsing,
      setBrowsingLimit: this.props.actions.setBrowsingLimit,
      setBrowsingQuery: this.props.actions.setBrowsingQuery,
      searchError: this.props.searchError,
      resetSearch: this.props.actions.resetSearch
    }
    return (
      <div style={Layout.leftNav(this.props.windowSize)}>
        <LeftWrapper {...left_wrapper_props}/>
      </div>
    )
  }

  // Include featured user as in homepage
  // Include list of users involved in thread as in thread
  // On small and medium screen: embeded in hidden right nav (LeftNav defined by MaterialUI)
  // On large screen: render as right nav
  renderUserList() {
    //Currently only filter users by comment
    if (this.props.routes[3].path) {
      if (this.props.routes[3].path.indexOf('thread/') > -1) {
        return (
          <div style={Layout.rightNav(this.props.windowSize)}>
            <ThreadUsers
                threadUsers={this.props.threadUserList}
                blacklist={this.props.blacklist}
                blacklistUser={this.props.actions.blacklistUser}
                whitelistUser={this.props.actions.whitelistUser}
                blacklistAll={this.props.actions.blacklistAll}
                whitelistAll={this.props.actions.whitelistAll}
                onUser={this.setUser}/>
          </div>
        )
      } 
    }
    return (
      <div style={Layout.rightNav(this.props.windowSize)}>
        <FeaturedUsers
            onUser={this.setUser} />
      </div>
    )
  }

  // New thread form in dialog
  renderNewThread() {
    let customActions = [
      <FlatButton
          key="1"
          label="Cancel"
          secondary={true}
          onTouchTap={this._cancelForm} />,
      <FlatButton
          key="2"
          label="Submit"
          primary={true}
          onTouchTap={this._submitForm} />
    ];
    return (
      <Dialog
          title="Create new thread"
          modal={true}
          actions={customActions}
          open={this.state.showDialog}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onRequestClose={this._closeDialog} >
        <ThreadForm
            categories={this.props.categories}
            clearState={this.clearNewThreadState}
            onCancel={this.state.cancelNewThread}
            onSubmit={this.state.submitNewThread}
            resetState={this.resetSubmitState}/>
      </Dialog>
    )
  }    

  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`);
  }

  setUser(id) {
    this.props.actions.pushPath(`/forum/user/${id}`);
  }

  _openDialog() {
    this.setState({showDialog: true});
  }

  _closeDialog() {
    this.setState({showDialog: false});
  }

  clearNewThreadState() {
    this.setState({cancelNewThread: null, submitNewThread: null, showDialog: false});
  }

  resetSubmitState() {
    this.setState({submitNewThread: null});
  }

  _cancelForm() {
    this.setState({cancelNewThread: true});
  }

  _submitForm() {
    this.setState({submitNewThread: true});
  }

  updateThreadList(thread) {
    let threads = this.state.threadList;
    this.setState({threadList: threads.concat(thread)});
  }

};

function mapStateToProps(state) {
  return {
    categories: state.categories,
    onUser: state.onUser,
    browsingThreads: state.browsingThreads,
    browsingLimit: state.browsingLimit,
    browsingQuery: state.browsingQuery,
    hasMoreBrowsing: state.hasMoreBrowsing,
    searchError: state.searchError,
    featuredThreads: state.featuredThreads,
    userThreads: state.userThreads,
    usersObserver: state.userObserver,
    browsingObserver: state.browsingObserver,
    newCommentId: state.newCommentId,
    newReplyHash: state.newReplyHash,
    createThreadError: state.createThreadError,
    threadUserList: state.threadUserList,
    blacklist: state.blacklist,
    windowSize: state.windowSize
  }
}

const actions = _.extend(BrowsingActions, CategoriesActions, FeaturesActions, ThreadActions, UserActions, UserThreadsActions, BlacklistActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
