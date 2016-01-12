import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import LeftWrapper from './left/left_wrapper';
import MiniProfile from './right/mini_profile';
import LogOn from './right/log_on';
import { windowSize } from './helpers';
import { LeftNav, IconButton, Avatar, FlatButton, AppBar, Popover, Styles } from 'material-ui';
import { ActionHome, ActionViewList, ActionHistory, SocialPerson, ContentClear } from 'material-ui/lib/svg-icons';
import ComponentStyle from './styles/app';
const { Colors, AutoPrefix } = Styles;
import * as sessionActions from './actions/session';
import * as WindowActions from './actions/window';
import * as BrowsingActions from './actions/browsing';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

//@connect(state => state)
export default class App extends Component {
  static contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object,
    store: PropTypes.object
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = {activePopover: false, windowSize: windowSize()};
    this.context = context;
    // Rendering methods decoupling from main render method
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.renderLeftIcon = this.renderLeftIcon.bind(this);
    this.renderUserAvatar = this.renderUserAvatar.bind(this);
    // Update popover state
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    // right SideNav manipulation
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidUpdate(preProps) {
    // Track Sign In and Sign Out event
    // Anchor to the right DOM element for Popover component
    if ((preProps.session === null && this.props.session) || (preProps.session && this.props.session === null)) {
      if (this.refs.signInButton) {
        this.setState({signinButton: ReactDOM.findDOMNode(this.refs.signInButton), activePopover: false});
      }
    }
  }

  componentDidMount() {
    this.props.actions.setWindowSize(windowSize());
    this.setState({signinButton: ReactDOM.findDOMNode(this.refs.signInButton)});
    // Track resize event for responsive layout
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    // WindowSize as 'small', 'medium', 'large'
    this.props.actions.setWindowSize(windowSize());
  }

  render() {
    let user = this.props.session;
    // Props for AppBar element
    let app_bar_props = {
      title: "DitchCrab",
      iconElementRight: this.renderRightIcon(),
    };
    // Burger menu button do not show on small screen
    if ( this.props.windowSize === 'small')  {
      app_bar_props.iconElementLeft = this.renderLeftIcon();
    } else {
      app_bar_props.showMenuIconButton = false;
    }
    //Props for Popover element
    // If user not signin -> Popover has LogOn form
    // Else -> Popover has MiniProfile
    let pop_over_props = {
      open: this.state.activePopover,
      anchorEl: this.state.signinButton,
      anchorOrigin: {horizontal: "right", vertical: "bottom"},
      targetOrigin: {horizontal: "right", vertical: "top"},
      onRequestClose: this.closePopover
    };
    let child_props = {
      section: this.state.section,
      openSideNav: this.state.sideNavOpen,
      closeSideNav: this.closeSideNav,
      currentUser: this.props.session,
      windowSize: this.props.windowSize
    };
    return (
      <div style={ComponentStyle.body}>
        <AppBar style={ComponentStyle.appBar} {...app_bar_props}/>
        <Popover className="right-popover" {...pop_over_props} >
          {user ? <MiniProfile currentUser={this.props.session} updateUserAvatar={this.props.actions.updateUserAvatar} signOut={this.props.actions.signOut}/> : <LogOn authError={this.props.authError} {...this.props.actions}/> }
        </Popover>
        {React.cloneElement(this.props.children, child_props)}
      </div>
    )
  }

  // Right incons includes:
  // For small screen: SignIn button OR Avatar, SocialPerson icon, AND ActionHistory
  // For medium screen: SignIn button OR Avatar, SocialPerson icon
  // For large screen: SignIn button OR Avatar
  renderRightIcon() {
    let user = this.props.session;
    var button;
    if (user) {
      button = this.renderUserAvatar();
    } else {
      button =  <FlatButton ref="signInButton" label="Log On" style={{color: Colors.white}} onClick={this.openPopover}/> 
    }
    return (
      <div>
        <IconButton onClick={() => {this.props.actions.pushPath('/forum')}}><ActionHome color={Colors.white}/></IconButton>
        { this.props.windowSize !== 'large' ? <IconButton onClick={this.openSideNav}> <SocialPerson color={Colors.white}/> </IconButton> : null }
        <div style={AutoPrefix.all(ComponentStyle.rightButton(this.props.session, this.props.windowSize))}>
          {button}
        </div>
      </div>
    )
  }

  // Burger Menu icon on the left
  renderLeftIcon() {
    if (this.props.browsingOpened) {
      return (
        <IconButton onClick={this.props.actions.closeBrowsing}>
          <ContentClear />
        </IconButton>
      )
    } else {
      return (
        <IconButton onClick={this.props.actions.openBrowsing}>
          <ActionViewList />
        </IconButton>
      )
    }
  }

  // If user has avatar image -> show image
  // Else: show first username letter
  renderUserAvatar() {
    let user = this.props.session;
    let avatar = <Avatar id="avatar-anchor" ref="signInButton" onClick={this.openPopover}>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        avatar = <Avatar id="avatar-anchor" src={user.profile.avatar} ref="signInButton" onClick={this.openPopover} />;
      }
    }
    return avatar;
  }

  openPopover() {
    if (this.state.activePopover === false) {
      this.setState({activePopover: true});      
    }
  }

  closePopover() {
    if (this.state.activePopover === true) {
      this.setState({activePopover: false});      
    }
  }

  openSideNav() {
    this.setState({sideNavOpen: true});
  }

  closeSideNav() {
    this.setState({sideNavOpen: false});
  }

};
function mapStateToProps(state) {
  return {
    windowSize: state.windowSize,
    session: state.session,
    browsingOpened: state.browsingOpened,
    authError: state.authError,
  }
}
const actions = _.extend(sessionActions, WindowActions, BrowsingActions, {pushPath: pushPath});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
