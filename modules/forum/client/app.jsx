import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import { LeftNav, IconButton, Avatar, FlatButton, AppBar, Popover, Styles } from 'material-ui';
import LeftWrapper from './left/left_wrapper';
import MiniProfile from './right/mini_profile';
import Login from './right/login';
import { NavigationMenu, NavigationClose } from 'material-ui/lib/svg-icons';
const { Colors } = Styles;

@ReactMixin.decorate(ReactMeteorData)
export default class App extends Component {
  constructor(props, context) {
    super(props);
    this.state = {activePopover: false, openMenu: true};
    this.context = context;
    this.renderLeft = this.renderLeft.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.renderLeftIcon = this.renderLeftIcon.bind(this);
    this.renderUserAvatar = this.renderUserAvatar.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.searchThreads = this.searchThreads.bind(this);
    this.viewThread = this.viewThread.bind(this);
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
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let user = this.data.user;
    // Props for AppBar element
    let app_bar_props = {
      title: "Modrn",
      iconElementRight: this.renderRightIcon(),
    };
    if ( w_w < 640)  {
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
      onRequestClose: this.closePopover.bind(this, 'pop')
    };
    
    return (
      <div>
        <AppBar {...app_bar_props}/>
        {w_w < 640 ? this.renderLeft() : null }
        <Popover className="right-popover" {...pop_over_props} >
          {user ? <MiniProfile /> : <Login /> }
        </Popover>
        {this.props.children}
      </div>
    )
  }

  renderLeft() {
    const left_nav_props = {
      docked: false,
      onNavClose: this.closeMenu,
      disableSwipeToOpen: true
    };
    const left_wrapper_props = {
      onSelectCategory: this.selectCategory,
      onSearch: this.searchThreads,
      viewThread: this.viewThread
    };
    return (
      <LeftNav ref="leftNav" {...left_nav_props}>
        <LeftWrapper {...left_wrapper_props}/>
      </LeftNav>
    )  
  }

  renderRightIcon() {
    let user = this.data.user;
    if (user) {
      return this.renderUserAvatar();
    } else {
      return (
        <FlatButton id="signin-anchor" ref="signInButton" label="Sign In" onClick={this.openPopover}/>        
      ) 
    }
  }

  renderLeftIcon() {
    return (
      <IconButton onClick={this.openMenu}>
        {this.state.openMenu ? <NavigationMenu /> : <NavigationClose /> }
      </IconButton>      
    )
  }

  renderUserAvatar() {
    let user = this.data.user;    
    if (user.profile) {
      if (user.profile.avatar) {
        return (
          <Avatar id="avatar-anchor" src={user.profile.avatar} ref="signInButton" onClick={this.openPopover} />                )
      }
    }
    return (
      <Avatar id="avatar-anchor" ref="signInButton" onClick={this.openPopover}>{user.username[0]}</Avatar>            )
  }
  
  openPopover() {
    this.setState({activePopover: true});
  }

  closePopover() {
    this.setState({activePopover: false});
  }

  openMenu() {
    this.setState({openMenu: !this.state.openMenu});
    this.refs.leftNav.toggle();
  }

  closeMenu() {
    this.setState({openMenu: true});
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

};

