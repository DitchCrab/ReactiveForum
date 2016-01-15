import { Component } from 'react';
import SignIn from './sign_in';
import SignUp from './sign_up';

export default class LogOn extends Component {
  
  constructor(props) {
    super();
    this.state = {view: 'signin'};
    this.switchView = this.switchView.bind(this);
  }

  render() {
    switch (this.state.view) {
      case 'signin':
        return <SignIn switchTo={this.switchView} signIn={this.props.signIn} authError={this.props.authError}/>;
        break;
      case 'signup':
        return <SignUp switchTo={this.switchView} signUp={this.props.signUp} authError={this.props.authError} />;
        break;
    }
  }

  switchView(view) {
    this.setState({view: view});
    this.props.clearAuthErr();
  }
  
};
