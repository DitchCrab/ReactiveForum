import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import LeftWrapper from './left/left_wrapper';
import MiniProfile from './right/mini_profile';
import LogOn from './right/log_on';
import { windowSize } from './helpers';
import { LeftNav, IconButton, Avatar, FlatButton, AppBar, Popover, Styles } from 'material-ui';
import { ActionViewList, ActionHistory, SocialPerson } from 'material-ui/lib/svg-icons';
import ComponentStyle from './styles/app';
const { Colors, AutoPrefix } = Styles;

//@connect(state => state)
@ReactMixin.decorate(ReactMeteorData)
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
    this.state = {activePopover: false, section: 'thread', windowSize: windowSize()};
    this.context = context;
    // Rendering methods decoupling from main render method
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.renderLeftIcon = this.renderLeftIcon.bind(this);
    this.renderUserAvatar = this.renderUserAvatar.bind(this);
    // Update view of ['thread', 'browsing'] on small screen
    this.viewSection = this.viewSection.bind(this);
    // Update popover state
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    // right SideNav manipulation
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  getMeteorData() {
    return {
      user: Meteor.user()
    }      
  }

  componentWillMount() {
    // Track Sign In and Sign Out event
    // Anchor to the right DOM element for Popover component
    Tracker.autorun(() => {
      Meteor.user();
      this.setState({activePopover: false});
      if (this.refs.signInButton) {
        this.setState({signinButton: ReactDOM.findDOMNode(this.refs.signInButton)});
      }
    })  
  }

  componentDidMount() {
    this.setState({signinButton: ReactDOM.findDOMNode(this.refs.signInButton)});
    // Track resize event for responsive layout
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    // WindowSize as 'small', 'medium', 'large'
    this.setState({windowSize: windowSize()});
  }

  render() {
    let user = this.data.user;
    // Props for AppBar element
    let app_bar_props = {
      title: "DitchCrab",
      onTitleTouchTap: this.viewSection.bind(null, 'thread'),
      iconElementRight: this.renderRightIcon(),
    };
    // Burger menu button do not show on small screen
    if ( this.state.windowSize === 'small')  {
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
      viewSection: this.viewSection,
      openSideNav: this.state.sideNavOpen,
      closeSideNav: this.closeSideNav,
      currentUser: this.data.user,
      windowSize: this.state.windowSize
    };
    return (
      <div style={ComponentStyle.body}>
        <AppBar style={ComponentStyle.appBar} {...app_bar_props}/>
        <Popover className="right-popover" {...pop_over_props} >
          {user ? <MiniProfile currentUser={user} /> : <LogOn /> }
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
    let user = this.data.user;
    var button;
    if (user) {
      button = this.renderUserAvatar();
    } else {
      button =  <FlatButton ref="signInButton" label="Log On" style={{color: Colors.white}} onClick={this.openPopover}/> 
    }
    return (
      <div>
        { this.props.params.thread && this.state.section === 'browsing' && this.state.windowSize === 'small' ? <IconButton onClick={this.viewSection.bind(null, 'thread')}><ActionHistory color={Colors.white}/></IconButton> : null }
        { this.state.windowSize !== 'large' ? <IconButton onClick={this.openSideNav}> <SocialPerson color={Colors.white}/> </IconButton> : null }
        <div style={AutoPrefix.all(ComponentStyle.rightButton(this.data.user, this.state.windowSize))}>
          {button}
        </div>
      </div>
    )
  }

  // Burger Menu icon on the left
  renderLeftIcon() {
    return (
      <IconButton onClick={this.viewSection.bind(null, 'browsing')}>
        <ActionViewList />
      </IconButton>
    )
  }

  // If user has avatar image -> show image
  // Else: show first username letter
  renderUserAvatar() {
    let user = this.data.user;
    let avatar = <Avatar id="avatar-anchor" ref="signInButton" onClick={this.openPopover}>{user.username[0]}</Avatar>;
    if (user.profile) {
      if (user.profile.avatar) {
        avatar = <Avatar id="avatar-anchor" src={user.profile.avatar} ref="signInButton" onClick={this.openPopover} />;
      }
    }
    return avatar;
  }

  viewSection(name) {
    this.setState({section: name});
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

export default connect(state => state)(App);
