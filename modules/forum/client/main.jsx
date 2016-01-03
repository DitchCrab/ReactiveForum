import { Component, PropTypes} from 'react';
import ReactMixin from 'react-mixin';
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
const { AutoPrefix } = Styles;

@ReactMixin.decorate(ReactMeteorData)
export default class Main extends Component {
    
  static contextTypes = {
    history: PropTypes.object.isRequired    
  }

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
  }

  static defaultProps = {
    section: 'browsing'
  }
  
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
      // Threads query limit
      browsing_limit: 10
    };
    // Update threads query on specific category
    this.selectCategory = this.selectCategory.bind(this);
    // Update threads query on search input
    this.searchThreads = this.searchThreads.bind(this);
    // If search not found, set threads query to none
    this.resetSearch = this.resetSearch.bind(this);
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
    // Refiltering users on particular thread
    this.updateBlackList = this.updateBlackList.bind(this);
    // Increase query limit on scroll down
    this.increaseBrowsingLimit = this.increaseBrowsingLimit.bind(this);
  }

  getMeteorData() {
    //Browsing threads (left nav)
    let browsing_query = {};
    let limit = 10;
    if (this.state.filterParams) {
      browsing_query = this.state.filterParams;
    }
    if (this.state.browsing_limit) {
      limit = this.state.browsing_limit;
    }
    let browsing_handler = Meteor.subscribe('browsing-threads', browsing_query, limit);
    let threads = Threads.find(browsing_query, {sort: {createdAt: -1}, limit: limit}).fetch();
    
    // User's threads or featured threads (main view)
    let user_thread_handler = Meteor.subscribe('user-threads', this.state.onUser);
    let featured_thread_handler = Meteor.subscribe('featured-threads');
    var viewUser;
    if (this.state.onUser) {
      let threads_1 = Threads.find({"user._id": this.state.onUser}).fetch();
      let threads_2 = Threads.find({comments: {$elemMatch: {userId: this.state.onUser}}}).fetch();
      viewUser = Meteor.users.findOne({_id: this.state.onUser});
      var mainThreads = _.uniq(_.union(threads_1, threads_2), (thread) => { return thread._id; });      
    } else {
      var mainThreads = Threads.find({}, {sort: {likes: -1}, limit: 20}).fetch();                
    }

    //Users with most contributions (right nav)
    let featured_users_handler = Meteor.subscribe('featured-users');
    let featured_users = Meteor.users.find({}).fetch();
    
    //Viewing thread (main view)
    let threadId = this.props.params.thread;
    let view_thread_handler = Meteor.subscribe('viewing-threads', threadId);
    var viewThread;
    if (threadId) {
      viewThread = Threads.findOne({_id: threadId});          
    }
    
    return {
      categories: Categories.find().fetch(),
      threads: threads,
      mainThreads: mainThreads,
      viewUser: viewUser,
      viewThread: viewThread,
      featuredUsers: featured_users,
    }
  }
  
  componentDidMount() {
    // Rendering the right view based on url
    if (this.props.params.thread) {
      this.props.viewSection.bind(null, 'thread')();
    }
  }

  render() {
    // Show error on failed search
    // Currently implementing naive search
    var search_error;
    if (this.state.filterParams && this.data.threads.length < 1) {
      if (this.state.filterParams.tags) {
        search_error = 'Sorry, no post found';
      }
    }
    let browsing = this.renderBrowsing(search_error);
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
            {browsing}
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
    const main_props = {
      userBlackList: this.state.userBlackList,
      mainThreads: this.data.mainThreads,
      thread: this.data.viewThread,
      currentUser: this.props.currentUser,
      viewThread: this.viewThread,
      category: this.state.category,
      threadList: this.state.threadList,
      updateThreadList: this.updateThreadList,
      viewUser: this.data.viewUser,
      windowSize: this.props.windowSize
    };
    return (
      <div style={Layout.mainThread(this.props.windowSize)}>
        <Wrapper {...main_props}/>
      </div>
    )
  }

  // Include search, category selection and list of threads
  // On small screen: render if 'section' is 'browsing'
  // On medium and large screen: render as right nav
  renderBrowsing(error) {
    const left_wrapper_props = {
      searchError: error,
      resetSearch: this.resetSearch,
      threads: this.data.threads,
      categories: this.data.categories,
      currentUser: this.props.currentUser,
      onSelectCategory: this.selectCategory,
      onSearch: this.searchThreads,
      viewThread: this.viewThread,
      increaseBrowsingLimit: this.increaseBrowsingLimit,
      windowSize: this.props.windowSize,
      openNewThreadDialog: this._openDialog
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
    let thread_users = [];
    if (this.data.viewThread) {
      thread_users = _.map(this.data.viewThread.comments, (comment) => { return comment.userId});      
    }
    if (this.data.viewThread) {
      return (
        <div style={Layout.rightNav(this.props.windowSize)}>
          <ThreadUsers
              threadUsers={thread_users}
              userBlackList={this.state.userBlackList}
              updateBlackList={this.updateBlackList}
              onUser={this.setUser}/>
        </div>
      )
    } else {
      return (
        <div style={Layout.rightNav(this.props.windowSize)}>
          <FeaturedUsers
              featuredUsers={this.data.featuredUsers}
              onUser={this.setUser} />
        </div>
      )
    }
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
          onRequestClose={this._closeDialog}
          width={this.props.windowSize === 'small' ? '90%' : '75%'}>
        <ThreadForm
            categories={this.data.categories}
            clearState={this.clearNewThreadState}
            onCancel={this.state.cancelNewThread}
            onSubmit={this.state.submitNewThread}
            resetState={this.resetSubmitState}/>
      </Dialog>
    )
  }    

  selectCategory(id) {
    switch (id) {
      // Hardcode id as 1. search all threads
      case 1:
        this.setState({browsing_limit: 10, filterParams: {}});
        break;
      // Hardcode id as 2. Search flag threads stored in user profile
      case 2:
        this.setState({browsing_limit: 10, filterParams: {_id: {$in: this.props.currentUser.profile ? this.props.currentUser.profile.flags : []}}});
        break;
      default:
        this.setState({browsing_limit: 10, filterParams: {category: id}});
    }
  }

  searchThreads(params) {
    // Search threads where tags match search array
    let tags = _.map(params.split(' '), (x) => x.trim());
    this.setState({filterParams: {tags: {$all: tags}}});
  }

  // If no result from search, reset it
  resetSearch() {
    this.setState({filterParams: null});
  }
  
  viewThread(id) {
    this.setState({viewThread: id});
    this.props.viewSection.bind(null, 'thread')();
    this.props.history.pushState(null, `/forum/${id}`);
  }

  setUser(id) {
    this.setState({onUser: id});
    this.props.history.pushState(null, `/forum`);        
    this.props.viewSection.bind(null, 'thread')();
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

  updateBlackList(arr) {
    this.setState({userBlackList: arr});
  }

  increaseBrowsingLimit() {
    this.setState({browsing_limit: this.state.browsing_limit + 10});
  }

};

