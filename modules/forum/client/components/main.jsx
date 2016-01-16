import { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// Components import
import LeftWrapper from './left/left_wrapper';
import ThreadUsers from './right/thread_users';
import FeaturedUsers from './right/featured_users';
import Layout from '../styles/layout';
import { FlatButton, LeftNav, Styles } from 'material-ui';
import ComponentStyle from 'forum/client/styles/main';
const { AutoPrefix } = Styles;
// Helpers
import moment from 'moment';
// Collections
import Categories from '../../collections/categories';
import Threads from '../../collections/threads';
// Redux actions
import * as BrowsingActions from '../actions/browsing';
import * as CategoriesActions from '../actions/categories';
import * as FeaturesActions from '../actions/features';
import * as ThreadActions from '../actions/thread';
import * as UserActions from '../actions/user';
import * as UserThreadsActions from '../actions/user_threads';
import * as BlacklistActions from '../actions/blacklist';
import * as SideNavActions from '../actions/side_nav';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

export class Main extends Component {
    
  static contextTypes = {
    history: PropTypes.object.isRequired    
  };

  static propTypes = {
    // React router params
    params: PropTypes.object,
    // SideNav state and callback
    sideNavOpened: PropTypes.bool,
    // User signed in object
    currentUser: PropTypes.object,
    // 'small', 'medium' or 'large' size
    windowSize: PropTypes.string,
    // Browing attributes
    categories: PropTypes.arrayOf(PropTypes.object),
    browsingOpened: PropTypes.bool,
    browsingThreads: PropTypes.arrayOf(PropTypes.object),
    browsingLimit: PropTypes.number,
    browsingQuery: PropTypes.object,
    hasMoreBrowsing: PropTypes.bool,
    searchError: PropTypes.string,
    // List of users on the right
    threadUserList: PropTypes.array,
    blacklist: PropTypes.array,
  };

  static defaultProps = {
    section: 'browsing'
  };
  
  constructor(props, context) {
    super(props);
    this.context = context;
    // Callback on click on specific thread card
    this.viewThread = this.viewThread.bind(this);
    // Rendering methods decoupling from main render method
    this.renderMain = this.renderMain.bind(this);
    this.renderBrowsing = this.renderBrowsing.bind(this);
    this.renderUserList = this.renderUserList.bind(this);
    // Fire when click on particular user avatar.
    // Result in querying and rendering list of threads which user contributed to
    this.setUser = this.setUser.bind(this);
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

  componentWillUnmount() {
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
      open: this.props.sideNavOpened,
      docked: false,
      onRequestChange: this.props.actions.closeSideNav,
      disableSwipeToOpen: true,
      openRight: true,
    };
    // Render based on screen size
    switch (this.props.windowSize) {
      case 'small':
        return (
          <section style={AutoPrefix.all(Layout.section)}>        
            { this.props.browsingOpened ? browsing : null }
            { !this.props.browsingOpened ? this.renderMain() : null }
            <LeftNav ref="rightNav" {...right_nav_props}>
              {filter_user}
            </LeftNav>
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
          </section>
        );
        break;
      case 'large':
        return (
          <section style={Layout.section}>
            { browsing }
            {this.renderMain()}
            {filter_user}
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
      pushPath: path => this.props.actions.pushPath(path)
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

  viewThread(id) {
    this.props.actions.pushPath(`/forum/thread/${id}`);
  }

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
    windowSize: state.windowSize
  }
}

const actions = _.extend(BrowsingActions, CategoriesActions, FeaturesActions, ThreadActions, UserActions, UserThreadsActions, BlacklistActions, SideNavActions, {pushPath: pushPath});
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
