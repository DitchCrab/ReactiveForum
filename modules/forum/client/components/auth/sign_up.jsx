import { Component, PropTypes } from 'react';
import { TextField, RaisedButton, FlatButton } from 'material-ui';
import ComponentStyle from '../../styles/auth/login';

/**
 * SignUp component
 * Is rendered on top right side of screen
 * Part of Logon component
 */
export default class SignUp extends Component {
  static propTypes = {
    // Switch to signin state
    switchTo: PropTypes.func,
    signUp: PropTypes.func,
    authErr: PropTypes.func,
    authError: PropTypes.string
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

  // @params key {string} - oneOf(['username', 'password'])
  // @params event {object} - syntheticEvent
  getSignUpInfo(key, event) {
    event.preventDefault();
    let pair = {};
    pair[key] = event.target.value;
    this.setState(pair);
  }
  
  userSignup() {
    let wrongChars = /\W/;
    let {username, password} = this.state;
    if (!username) {
      this.props.authErr({reason: 'Username is missing'});
    } else if (!password) {
      this.props.authErr({reason: 'Password is missing'});
    } else  if (wrongChars.test(username)) {
      this.props.authErr({reason: 'Invalid username. Please only user letters, numbers or underscore in username!'}); 
    } else if (password.length < 6) {
      this.props.authErr({reason: 'Password is too short. I must have more than 6 characters.'});
    } else {
      this.props.signUp(username, password);
    }
  }
  
}
