import { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// Components import
import LeftWrapper from './left/left_wrapper';
import ThreadUsers from './right/thread_users';
import FeaturedUsers from './right/featured_users';
import Layout from '../styles/layout';
import { FlatButton, LeftNav, Snackbar, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/main';
import Prefixer from 'inline-style-prefixer';
const prefixer = new Prefixer();
// Helpers
import moment from 'moment';
// Collections
import Categories from '../../collections/categories';
import Threads from '../../collections/threads';
// Redux actions
import {
  BrowsingActions,
  CategoriesActions,
  FeaturesActions,
  ThreadActions,
  UserActions,
  UserThreadsActions,
  BlacklistActions,
  SideNavActions,
  SnackbarActions
} from '../actions';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

/**
* Main component
* Responsible for manipulating layout
* Because Browsing component and User list are shared between pages
* Main component also wrap Left and Right sections
* Center section is render by React Router
*/
export class Main extends Component {
    
  static contextTypes = {
    history: PropTypes.object.isRequired    
  };

  static propTypes = {
    params: PropTypes.shape({ // Router params
      id: PropTypes.string
    }),
    sideNavOpened: PropTypes.bool, // On small and medium screen, list of user are hidden in RightNav
    currentUser: PropTypes.object, // User signed in object
    windowSize: PropTypes.oneOf(['small', 'medium', 'large']),
    categories: PropTypes.arrayOf(PropTypes.object), // Thread categories
    browsingOpened: PropTypes.bool, // On small screen, browsing view is hidden
    // Dynamic query
    browsingThreads: PropTypes.arrayOf(PropTypes.object), 
    browsingLimit: PropTypes.number,
    browsingQuery: PropTypes.object,
    hasMoreBrowsing: PropTypes.bool, // Use to stop scrolling if fetch does not return any more threads
    searchError: PropTypes.string,
    threadUserList: PropTypes.array, // Users who commend on thread
    blacklist: PropTypes.array, // Hide user in blacklist
    actions: PropTypes.shape({
      getBrowsingThreads: PropTypes.func,
      getInitialCategories: PropTypes.func,
      setSearchErr: PropTypes.func,
      setHasMoreBrowsing: PropTypes.func,
      setBrowsingQuery: PropTypes.func,
      setBrowsingLimit: PropTypes.func,
      closeSideNav: PropTypes.func,
      resetSearch: PropTypes.func,
      pushPath: PropTypes.func,
      openSnackbar: PropTypes.func,
      closeSnackbar: PropTypes.func,
      likeThread: PropTypes.func,
      flagThread: PropTypes.func,
      unflagThread: PropTypes.func,
      blacklistUser: PropTypes.func,
      whitelistUser: PropTypes.func,
      blacklistAll: PropTypes.func,
      whitelistAll: PropTypes.func
    })
  };

  constructor(props, context) {
    super(props);
    this.context = context;
    // Rendering methods decoupling from main render method
    this.renderMain = this.renderMain.bind(this);
    this.renderBrowsing = this.renderBrowsing.bind(this);
    this.renderUserList = this.renderUserList.bind(this);
    this.renderSnackbar = this.renderSnackbar.bind(this);
    // Callback on click on specific thread card
    this.viewThread = this.viewThread.bind(this);
    // Fire when click on particular user avatar.
    // Result in querying and rendering list of threads which user contributed to
    this.setUser = this.setUser.bind(this);
  }

  // Use for serverside rendering
  componentWillMount() {
    let threads = Threads.find({}, {sort: {createdAt: -1}, limit: 10}).fetch();
    this.props.actions.getBrowsingThreads(threads);
  }

  componentDidMount() {
    // Get initial categories without watching changes
    this.props.actions.getInitialCategories();
    // User reactive dict to convert props to meteor reactive var
    this.browsingDict = new ReactiveDict('browsing');
    this.browsingDict.set('limit', this.props.browsingLimit);
    this.browsingDict.set('query', this.props.browsingQuery);
    // Watch change and update redux state
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
    });
  }

  // Unregister memory when navigate to other section
  componentWillUnmount() {
    this.browsingTracker.stop();
    delete ReactiveDict._dictsToMigrate.browsing;
  }

  componentWillReceiveProps(nextProps, nextState) {
    // Reactive update using reactive dict
    if (this.props.browsingLimit !== nextProps.browsingLimit) {
      this.browsingDict.set('limit', nextProps.browsingLimit);
    }
    if (this.props.browsingQuery !== nextProps.browsingQuery) {
      this.browsingDict.set('query', nextProps.browsingQuery);
    }
  }

  render() {
    const filter_user = this.renderUserList();
    // As defined in MaterialUI as LeftNav
    // Only show in small and medium screen
    // Include FeaturedUsers at homepage AND UserList at thread page
    const right_nav_props = {
      open: this.props.sideNavOpened,
      docked: false,
      onRequestChange: this.props.actions.closeSideNav,
      disableSwipeToOpen: true,
      openRight: true,
    };
    const section_style = prefixer.prefix(Layout.section);
    // Render based on screen size
    switch (this.props.windowSize) {
      case 'small':
        return (
          <section style={section_style}>        
            {this.renderBrowsing()}
            { !this.props.browsingOpened ? this.renderMain() : null }
            <LeftNav ref="rightNav" {...right_nav_props}>
              {filter_user}
            </LeftNav>
            {this.renderSnackbar()}
          </section>
        );
      case 'medium':
        return (
          <section style={section_style}>        
            {this.renderBrowsing()}
            {this.renderMain()}
            <LeftNav ref="rightNav" {...right_nav_props}>
              {filter_user}
            </LeftNav>
            {this.renderSnackbar()}
          </section>
        );
      case 'large':
        return (
          <section style={section_style}>
            { this.renderBrowsing() }
            {this.renderMain()}
            {filter_user}
            {this.renderSnackbar()}
          </section>
        );
    }
  }

/** Center component in 'large' and 'medium' screens
* Main component in 'small' screen.
* Depending on router. Children may be:
* Featured threads as Features component
* User's threads as User component
* New thread form as NewThread component
* EditThread form as EditThread component
* Thread component
*/
  renderMain() {
    return (
      <div style={Layout.mainThread(this.props.windowSize)}>
        <div style={ComponentStyle.mainWrapper(this.props.windowSize)}>
          {this.props.children}
        </div>
      </div>
      )
  }

/**
* Browsing view is always availabe for 'large' and 'medium' screens
* For small screen, it is opened through burger icon
* This view has search field, categories select field and list of threads
*/
  renderBrowsing() {
    const display = this.props.browsingOpened ? 'initial' : 'none';
    const left_wrapper_props = {
      browsingOpened: this.props.browsingOpened,
      thread: this.props.thread,
      threads: this.props.browsingThreads,
      categories: this.props.categories,
      currentUser: this.props.currentUser,
      viewThread: this.viewThread,
      windowSize: this.props.windowSize,
      hasMoreBrowsing: this.props.hasMoreBrowsing,
      browsingLimit: this.props.browsingLimit,
      setHasMoreBrowsing: this.props.actions.setHasMoreBrowsing,
      setBrowsingLimit: this.props.actions.setBrowsingLimit,
      setBrowsingQuery: this.props.actions.setBrowsingQuery,
      searchError: this.props.searchError,
      resetSearch: this.props.actions.resetSearch,
      pushPath: path => this.props.actions.pushPath(path),
      openSnackbar: this.props.actions.openSnackbar,
      likeThread: this.props.actions.likeThread,
      flagThread: this.props.actions.flagThread,
      unflagThread: this.props.actions.unflagThread,
    }
    return (
      <div style={Layout.leftNav(this.props.windowSize, display)}>
        <LeftWrapper {...left_wrapper_props}/>
      </div>
    )
  }

/**
* User list view is always availabe in 'large' screens
* For 'small' and 'medium' screen', it is opened as Rightnav by clicking on SocialPerson icon in Appbar
* If user is viewing Thread component, User list view renders ThreadUsers
* Else: it renders FeaturedUsers
*/
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
  
  // Display call to action message
  renderSnackbar() {
    return (
      <Snackbar
          open={this.props.snackbarOpen}
          message="Please log on to unlock more fun"
          autoHideDuration={3000}
          onRequestClose={this.props.actions.closeSnackbar}
      />
    )    
  }

  // @params id {string} - threadId
  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`);
  }

  // @params id {string} - threadId
  setUser(id) {
    this.props.actions.pushPath(`/forum/user/${id}`);
  }

};

function mapStateToProps(state) {
  return {
    currentUser: state.session,
    categories: state.categories,
    browsingOpened: state.browsingOpened,
    browsingThreads: state.browsingThreads,
    browsingLimit: state.browsingLimit,
    browsingQuery: state.browsingQuery,
    hasMoreBrowsing: state.hasMoreBrowsing,
    searchError: state.searchError,
    sideNavOpened: state.sideNavOpened,
    threadUserList: state.threadUserList,
    blacklist: state.blacklist,
    windowSize: state.windowSize,
    snackbarOpen: state.snackbarOpen,
    thread: state.thread
  }
}

const actions = _.extend(BrowsingActions, CategoriesActions, FeaturesActions, ThreadActions, UserActions, UserThreadsActions, BlacklistActions, SideNavActions, SnackbarActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
