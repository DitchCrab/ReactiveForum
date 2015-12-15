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
    this.redirect = this.redirect.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.redirectMain = this.redirectMain.bind(this);
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
    Tracker.autorun(() => {
      Meteor.user();
      this.setState({activePopover: false});
      if (this.refs.signInButton) {
        this.setState({signinButton: this.refs.signInButton.getDOMNode()});
      }
    })  
  }
  
  componentDidMount() {
    this.setState({signinButton: ReactDOM.findDOMNode(this.refs.signInButton)})  ;
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let nav = (() => { return (
      <LeftNav ref="leftNav" docked={false} onNavClose={this.closeMenu} disableSwipeToOpen={true}>
        <LeftWrapper onSelectCategory={this.selectCategory} onSearch={this.searchThreads} viewThread={this.viewThread}/>
      </LeftNav>
    )})();
    let icon_left = <IconButton onClick={this.openMenu}>{this.state.openMenu ? <NavigationMenu /> : <NavigationClose /> }</IconButton>;
    if (this.data.user) {
      var icon_right = <Avatar src="avatar.png" ref="signInButton" onClick={this.openPopover} />;
    } else {
      var icon_right = <FlatButton ref="signInButton" label="Sign In" onClick={this.openPopover}/>;
    }
    if ( w_w < 640)  {
      var app_bar = <AppBar
                        title="Meet Expat"
                        iconElementLeft={icon_left}
                        iconElementRight={icon_right} />
    } else {
      var app_bar = <AppBar
                        title="Meet Expat"
                        showMenuIconButton={false}
                        iconElementRight={icon_right} />
    }
    return (
      <div>
        {app_bar}
        {w_w < 640 ? nav : null }
        <Popover open={this.state.activePopover}
                 anchorEl={this.state.signinButton}
                 anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                 targetOrigin={{horizontal: "right", vertical: "top"}}
                 onRequestClose={this.closePopover.bind(this, 'pop')} >
          {this.data.user ? <MiniProfile /> : <Login /> }
        </Popover>
        {this.props.children}
      </div>
    )
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

  redirect() {
    this.props.history.pushState(null, '/discover');
  }

  redirectMain(url) {
    this.props.history.pushState(null, url);
    this.refs.leftNav.close();
  }

  selectCategory(id) {
    Session.set('category', id);
  }

  searchThreads(params) {
    Session.set('search', params);
  }

  viewThread(id) {
    Session.set('viewThread', id);
    this.props.history.pushState(null, `/explore/${id}`);
  }

};

App.contextTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

App.defaultProps = {
  appLinks: [{text: 'Life Style', route: '/life_style'},
             {text: 'Expat', route: '/expat'},
             {text: 'Shared Experiences', route: '/shared_experiences'},
             {text: 'Opportunity', route: '/opportunity'}
  ]
}

