import { Component, PropTypes } from 'react';
import SignIn from './sign_in';
import SignUp from './sign_up';

/**
* Logon component
* Is render on Popover on top right side of screen
* Wrapper for SignIn and SignOut components
*/
export default class LogOn extends Component {
  static propTypes = {
    signIn: PropTypes.func,
    signUp: PropTypes.func,
    authError: PropTypes.string,
    clearAuthErr: PropTypes.func
  };
  
  constructor(props) {
    super();
    this.state = {view: 'signin'};
    this.switchView = this.switchView.bind(this);
  }

  render() {
    switch (this.state.view) {
      case 'signin':
        return <SignIn switchTo={this.switchView} signIn={this.props.signIn} authError={this.props.authError}/>;
      case 'signup':
        return <SignUp switchTo={this.switchView} signUp={this.props.signUp} authError={this.props.authError} />;
    }
  }

  // params view {string} - oneOf(['signin', 'signup'])
  switchView(view) {
    this.setState({view: view});
    this.props.clearAuthErr();
  }
  
};
