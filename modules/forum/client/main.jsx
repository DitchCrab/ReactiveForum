import { Component, PropTypes} from 'react';
import ReactMixin from 'react-mixin';
import { FlatButton, LeftNav } from 'material-ui';
import Dialog from 'material-ui/lib/dialog';
import Wrapper from './thread/wrapper';
import LeftWrapper from './left/left_wrapper';
import ThreadUsers from './right/thread_users';
import ThreadForm from './widgets/thread_form';
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
    openSideNav: PropTypes.func,
    closeSideNav: PropTypes.func,
    currentUser: PropTypes.object
  }

  static defaultProps = {
    section: 'browsing'
  }
  
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {showDialog: false, newThread: {}, threadList: [], userBlackList: []};
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
  }

  getMeteorData() {
    //Browsing threads
    let threads = Threads.find({}, {sort: {createdAt: -1}}).fetch();
    if (this.state.filterParams) {
      threads = Threads.find(this.state.filterParams, {sort: {createdAt: -1}}).fetch();
    }
    // User's threads or featured threads
    let mainThreads = [];
    let onUser = this.state.onUser;          
    if (onUser) {
      let threads_1 = Threads.find({"user._id": onUser}).fetch();
      let threads_2 = Threads.find({comments: {$elemMatch: {userId: onUser}}}).fetch();
      mainThreads = _.uniq(_.union(threads_1, threads_2), (thread) => { return thread._id; });
    } else {
      mainThreads = Threads.find().fetch();                
    }
    //Viewing thread
    var viewThread;
    if (this.props.params.thread) {
      viewThread = Threads.findOne({_id: this.props.params.thread});          
    }
    return {
      categories: Categories.find().fetch(),
      threads: threads,
      mainThreads: mainThreads,
      viewThread: viewThread
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

    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let browsing = this.renderBrowsing(search_error);
    let filter_user = this.renderFilterUser();
    let thread = this.data.viewThread ? this.renderThread() : null;
    if (w_w >= 640) {
      return (
        <section className="s-grid-top main-section">
          {browsing}
          {this.renderThread()}
          {filter_user}
          { this.props.currentUser ? this.renderNewThread() : null }
        </section>
      )
    } else {
      const right_nav_props = {
        docked: false,
        onNavClose: this.props.closeSideNav,
        disableSwipeToOpen: true,
        openRight: true,
        onNavClose: this.props.closeSideNav.bind(null)
      }
      return (
        <section className="s-grid-top main-section">        
          { this.props.section === 'browsing' ? browsing : null }
          { this.props.section === 'thread' ? thread : null }
          <LeftNav ref="rightNav" {...right_nav_props}>
            {filter_user}
          </LeftNav>
          { this.props.currentUser ? this.renderNewThread() : null }
        </section>
      )      
    }
  }

  renderThread() {
    return (
      <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-md-6 s-grid-cell-lg-7">
        <Wrapper userBlackList={this.state.userBlackList} mainThreads={this.data.mainThreads} thread={this.data.viewThread} currentUser={this.props.currentUser} viewThread={this.viewThread} category={this.state.category} threadList={this.state.threadList} updateThreadList={this.updateThreadList}/>
      </div>
    )
  }

  renderBrowsing(error) {
    return (
      <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-md-3 s-grid-cell-lg-3">
        <LeftWrapper searchError={error} resetSearch={this.resetSearch} threads={this.data.threads} categories={this.data.categories} currentUser={this.props.currentUser} onSelectCategory={this.selectCategory} onSearch={this.searchThreads} viewThread={this.viewThread}/>
      </div>
    )
  }

  renderFilterUser() {
    let thread_users = [];
    if (this.data.viewThread) {
      thread_users = _.map(this.data.viewThread.comments, (comment) => { return comment.userId});      
    }
    return (
      <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-md-3 s-grid-cell-lg-2">
        <ThreadUsers threadUsers={thread_users} userBlackList={this.state.userBlackList} updateBlackList={this.updateBlackList} onUser={this.setUser}/>
      </div>
    )
  }

  renderNewThread() {
    let customActions = [
      <FlatButton
          className="thread-form-cancel"
          key="1"
          label="Cancel"
          secondary={true}
          onTouchTap={this._cancelForm} />,
      <FlatButton
          className="thread-form-submit"
          key="2"
          label="Submit"
          primary={true}
          onTouchTap={this._submitForm} />
    ];
    return (
      <Dialog
          title="Create new thread"
          actions={customActions}
          actionFocus="submit"
          open={this.state.showDialog}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onRequestClose={this._closeDialog}>
        <ThreadForm categories={this.data.categories} threadParams={this.state.newThread} onEdit={this.editNewThread}/>
      </Dialog>
    )
  }    

  selectCategory(id) {
    this.setState({filterParams: {category: id}});
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
    Session.set('onUser', id);
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
};

