import { Component, PropTypes } from 'react';
import { TextField, RaisedButton, FlatButton } from 'material-ui';
import ComponentStyle from 'forum/client/styles/right/login';

export default class SignUp extends Component {
  static propTypes = {
    // Switch to signin state
    switchTo: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {username: null, password: null};
    this.getSignUpInfo = this.getSignUpInfo.bind(this);
    this.userSignup = this.userSignup.bind(this);
  }

  render() {
    return (
      <div style={ComponentStyle.wrapper}>
        <h3 style={ComponentStyle.header}>Sign Up</h3>
        <p style={ComponentStyle.error}>{this.props.authError}</p>
        <TextField
            hintText="New username" value={this.state.username} onChange={this.getSignUpInfo.bind(null, 'username')} />
        <TextField
            hintText="New password" type="password" value={this.state.password} onChange={this.getSignUpInfo.bind(null, 'password')} />
        <RaisedButton primary={true} label="Sign Up" style={ComponentStyle.loginButton} onClick={this.userSignup}/>
        <br/>
        <FlatButton label="Sign In" onClick={this.props.switchTo.bind(null, 'signin')}/>
      </div>
    )
  }

  getSignUpInfo(key, event) {
    event.preventDefault();
    let pair = {};
    pair[key] = event.target.value;
    this.setState(pair);
  }
  
  userSignup() {
    let wrongChars = /\W/;
    let {username, password} = this.state;
    if (username === undefined || username === null) {
      this.setState({error: 'Username is missing'});
    } else if (password === undefined || password === null) {
      this.setState({error: 'Password is missing'});
    } else  if (wrongChars.test(username)) {
      this.setState({error: 'Invalid username. Please only user letters, numbers or underscore in username!'});
    } else {
      this.props.signUp(username, password)();
    }
  }
  
}
