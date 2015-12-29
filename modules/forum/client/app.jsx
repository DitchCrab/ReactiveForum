import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import { windowSize } from './helpers';
import { LeftNav, IconButton, Avatar, FlatButton, AppBar, Popover, Styles } from 'material-ui';
import LeftWrapper from './left/left_wrapper';
import MiniProfile from './right/mini_profile';
import Login from './right/login';
import { ActionViewList, ActionHistory, SocialPerson } from 'material-ui/lib/svg-icons';
const { Colors } = Styles;

@ReactMixin.decorate(ReactMeteorData)
export default class App extends Component {
  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  static propTypes = {
    params: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props);
    this.state = {activePopover: false, section: 'thread', windowSize: windowSize()};
    this.context = context;
    this.handleResize = this.handleResize.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.renderLeftIcon = this.renderLeftIcon.bind(this);
    this.renderUserAvatar = this.renderUserAvatar.bind(this);
    this.viewSection = this.viewSection.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.searchThreads = this.searchThreads.bind(this);
    this.viewThread = this.viewThread.bind(this);
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
  }

  getMeteorData() {
    return {
      user: Meteor.user()
    }      
  }

  componentWillMount() {
    /* Track Sign In and Sign Out event
       anchor the right DOM element for popover */
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
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({windowSize: windowSize()});
  }

  render() {
    let user = this.data.user;
    // Props for AppBar element
    let app_bar_props = {
      title: "Modrn",
      onTitleTouchTap: this.viewSection.bind(null, 'thread'),
      iconElementRight: this.renderRightIcon(),
      style: {position: 'fixed', top: 0, left: 0}
    };
    if ( this.state.windowSize === 'small')  {
      app_bar_props.iconElementLeft = this.renderLeftIcon();
    } else {
      app_bar_props.showMenuIconButton = false;
    }
    //Props for Popover element
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
      updateSection: this.viewSection,
      windowSize: this.state.windowSize
    };
    return (
      <div>
        <AppBar {...app_bar_props}/>
        <Popover className="right-popover" {...pop_over_props} >
          {user ? <MiniProfile currentUser={user} /> : <Login /> }
        </Popover>
        {React.cloneElement(this.props.children, child_props)}
      </div>
    )
  }

  renderRightIcon() {
    let user = this.data.user;
    var button;
    if (user) {
      button = this.renderUserAvatar();
    } else {
      button =  <FlatButton id="signin-anchor" ref="signInButton" label="Sign In" onClick={this.openPopover}/>        
    }
    return (
      <div>
        { this.props.params.thread && this.state.section === 'browsing' && this.state.windowSize === 'small' ? <IconButton onClick={this.viewSection.bind(null, 'thread')}><ActionHistory color={Colors.white}/></IconButton> : null }
        { this.state.windowSize !== 'large' ? <IconButton onClick={this.openSideNav}> <SocialPerson color={Colors.white}/> </IconButton> : null }
        <span style={{marginLeft: 10}}>
          {button}
        </span>
      </div>
    )
  }

  renderLeftIcon() {
    return (
      <IconButton onClick={this.viewSection.bind(null, 'browsing')}>
        <ActionViewList />
      </IconButton>
    )
  }

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

  selectCategory(id) {
    Session.set('category', id);
  }

  searchThreads(params) {
    Session.set('search', params);
  }

  viewThread(id) {
    Session.set('viewThread', id);
    this.props.history.pushState(null, `/forum/${id}`);
  }

  openSideNav() {
    this.setState({sideNavOpen: true});
  }

  closeSideNav() {
    this.setState({sideNavOpen: false});
  }

};

