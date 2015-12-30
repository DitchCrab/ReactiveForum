import { Component, PropTypes} from 'react';
import ReactMixin from 'react-mixin';
import { FlatButton, LeftNav } from 'material-ui';
import Layout from 'forum/client/styles/layout';
import Dialog from 'material-ui/lib/dialog';
import Wrapper from './thread/wrapper';
import LeftWrapper from './left/left_wrapper';
import ThreadUsers from './right/thread_users';
import ThreadForm from './widgets/thread_form';
import FeaturedUsers from './right/featured_users';
import ThreadImgs from 'forum/collections/thread_imgs';
import moment from 'moment';
import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';


@ReactMixin.decorate(ReactMeteorData)
export default class Main extends Component {
    
  static contextTypes = {
    history: PropTypes.object.isRequired    
  }

  static propTypes = {
    params: PropTypes.object,
    viewSection: PropTypes.func,
    openSideNav: PropTypes.bool,
    closeSideNav: PropTypes.func,
    currentUser: PropTypes.object,
    updateSection: PropTypes.func,
    windowSize: PropTypes.string
  }

  static defaultProps = {
    section: 'browsing'
  }
  
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {
      showDialog: false,
      newThread: {},
      threadList: [],
      userBlackList: [],
      browsing_limit: 5
    };
    this.selectCategory = this.selectCategory.bind(this);
    this.searchThreads = this.searchThreads.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.viewThread = this.viewThread.bind(this);
    this.renderThread = this.renderThread.bind(this);
    this.renderBrowsing = this.renderBrowsing.bind(this);
    this.renderFilterUser = this.renderFilterUser.bind(this);
    this.setUser = this.setUser.bind(this);
    this.renderNewThread = this.renderNewThread.bind(this);
    this._openDialog = this._openDialog.bind(this);      
    this._closeDialog = this._closeDialog.bind(this);
    this._cancelForm = this._cancelForm.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this.editNewThread = this.editNewThread.bind(this);
    this.updateThreadList = this.updateThreadList.bind(this);
    this.updateBlackList = this.updateBlackList.bind(this);
    this.increaseBrowsingLimit = this.increaseBrowsingLimit.bind(this);
  }

  getMeteorData() {
    //Browsing threads
    let browsing_query = {};
    let limit = 5;
    if (this.state.filterParams) {
      browsing_query = this.state.filterParams;
    }
    if (this.state.browsing_limit) {
      limit = this.state.browsing_limit;
    }
    let browsing_handler = Meteor.subscribe('browsing-threads', browsing_query, limit);
    let threads = Threads.find(browsing_query, {sort: {createdAt: -1}, limit: limit}).fetch();
    
    // User's threads or featured threads
    let user_thread_handler = Meteor.subscribe('user-threads', this.state.onUser);
    let featured_thread_handler = Meteor.subscribe('featured-threads');
    if (this.state.onUser) {
      let threads_1 = Threads.find({"user._id": this.state.onUser}).fetch();
      let threads_2 = Threads.find({comments: {$elemMatch: {userId: this.state.onUser}}}).fetch();
      var mainThreads = _.uniq(_.union(threads_1, threads_2), (thread) => { return thread._id; });      
    } else {
      var mainThreads = Threads.find({}, {sort: {likes: -1}}).fetch();                
    }

    //Users with most contributions
    let featured_users_handler = Meteor.subscribe('featured-users');
    let featured_users = Meteor.users.find({}).fetch();
    
    //Viewing thread
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
      viewThread: viewThread,
      featuredUsers: featured_users,
    }
  }
  
  componentWillMount() {
    // Hack to open dialog to create new thread.
    // Todo: bind callback
    Tracker.autorun(() => {
      if (Session.get('openNewThreadDialog') && !this.state.showDialog) {
        this._openDialog();
        Session.set('openNewThreadDialog', null);
      }
    })
  }

  componentDidMount() {
    if (this.props.params.thread) {
      this.props.viewSection.bind(null, 'thread')();
    }
  }

  componentDidUpdate() {
    if (this.props.openSideNav === true) {
      this.refs.rightNav.toggle();
    }
  }

  render() {
    var search_error;
    if (this.state.filterParams && this.data.threads.length < 1) {
      if (this.state.filterParams.tags) {
        search_error = 'Sorry, no post found';
      }
    }
    let browsing = this.renderBrowsing(search_error);
    let filter_user = this.renderFilterUser();
    const right_nav_props = {
      docked: false,
      onRequestChange: this.props.closeSideNav,
      disableSwipeToOpen: true,
      openRight: true,
    };
    switch (this.props.windowSize) {
      case 'small':
        return (
          <section style={Layout.section}>        
            { this.props.section === 'browsing' ? browsing : null }
            { this.props.section === 'thread' ? this.renderThread() : null }
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
            {this.renderThread()}
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
            {this.renderThread()}
            {filter_user}
            { this.props.currentUser ? this.renderNewThread() : null }
          </section>
        );
        break;
    }
  }

  renderThread() {
    const main_props = {
      userBlackList: this.state.userBlackList,
      mainThreads: this.data.mainThreads,
      thread: this.data.viewThread,
      currentUser: this.props.currentUser,
      viewThread: this.viewThread,
      category: this.state.category,
      threadList: this.state.threadList,
      updateThreadList: this.updateThreadList,
      onUser: this.state.onUser,
      windowSize: this.props.windowSize
    };
    return (
      <div style={Layout.mainThread(this.props.windowSize)}>
        <Wrapper {...main_props}/>
      </div>
    )
  }

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
      windowSize: this.props.windowSize
    }
    return (
      <div style={Layout.leftNav(this.props.windowSize)}>
        <LeftWrapper {...left_wrapper_props}/>
      </div>
    )
  }

  renderFilterUser() {
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
          actions={customActions}
          open={this.state.showDialog}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onRequestClose={this._closeDialog}>
        <ThreadForm
            categories={this.data.categories}
            threadParams={this.state.newThread}
            onEdit={this.editNewThread}/>
      </Dialog>
    )
  }    

  selectCategory(id) {
    switch (id) {
      case 1:
        this.setState({filterParams: {}});
        break;
      case 2:
        this.setState({filterParams: {_id: {$in: this.props.currentUser.profile ? this.props.currentUser.profile.flags : []}}});
        break;
      default:
        this.setState({filterParams: {category: id}});
    }
  }

  searchThreads(params) {
    let tags = _.map(params.split(' '), (x) => x.trim());
    this.setState({filterParams: {tags: {$all: tags}}});
  }

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
    this.props.updateSection.bind(null, 'thread')();
  }

  _openDialog() {
    this.setState({showDialog: true});
  }

  _closeDialog() {
    this.setState({showDialog: false});
  }

  _cancelForm() {
    this.setState({newThread: {}, showDialog: false});
  }

  _submitForm() {
    ThreadImgs.insert(this.state.newThread.img, (err, imgObj) => {
      let params = this.state.newThread;
      params['imgId'] = imgObj._id;
      Meteor.call('createThread', params, (err, res) => {
        this.setState({newThread: {}, showDialog: false});                          
      })
    });
  }

  editNewThread(key, value) {
    let thread_params = this.state.newThread;
    thread_params[key] = value;
    this.setState({newThread: thread_params});
  }

  updateThreadList(thread) {
    let threads = this.state.threadList;
    this.setState({threadList: threads.concat(thread)});
  }

  updateBlackList(arr) {
    this.setState({userBlackList: arr});
  }

  increaseBrowsingLimit() {
    this.setState({browsing_limit: this.state.browsing_limit + 5});
  }

};

