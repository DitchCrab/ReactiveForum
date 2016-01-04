import { Component } from 'react';
import SignIn from 'forum/client/widgets/sign_in';
import SignUp from 'forum/client/widgets/sign_up';

export default class LogOn extends Component {
  constructor(props) {
    super();
    this.state = {view: 'signin'};
    this.switchView = this.switchView.bind(this);
  }

  render() {
    switch (this.state.view) {
      case 'signin':
        return <SignIn switchTo={this.switchView} />;
        break;
      case 'signup':
        return <SignUp switchTo={this.switchView} />;
        break;
    }
  }

  switchView(view) {
    this.setState({view: view});
  }
  
};
