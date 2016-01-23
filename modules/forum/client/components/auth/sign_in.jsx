import { Component, PropTypes } from 'react';
import { TextField, RaisedButton, FlatButton } from 'material-ui';
import ComponentStyle from '../../styles/auth/login';

// Auth component for sign in
export default class SignIn extends Component {
  static propTypes = {
    // Switch to signup state
    switchTo: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {username: null, password: null};
    this.getSignInInfo = this.getSignInInfo.bind(this);
    this.userSignin = this.userSignin.bind(this);
  }

  render() {
    return (
      <div style={ComponentStyle.wrapper}>
        <h3 style={ComponentStyle.header}>Sign In</h3>
        <p style={ComponentStyle.error}>{this.props.authError}</p>
        <TextField
            hintText="Username" value={this.state.username} onChange={this.getSignInInfo.bind(null, 'username')} />
        <TextField
            hintText="Password" type="password" value={this.state.password} onChange={this.getSignInInfo.bind(null, 'password')} />
        <RaisedButton primary={true} label="Sign In" style={ComponentStyle.loginButton} onClick={this.userSignin}/>
        <br/>
        <FlatButton label="Sign Up" onClick={this.props.switchTo.bind(null, 'signup')}/>
      </div>
    )
  }

  getSignInInfo(key, event) {
    event.preventDefault();
    let pair = {};
    pair[key] = event.target.value;
    this.setState(pair);
  }
  
  userSignin() {
    let {username, password} = this.state;
    if (username === undefined || username === null) {
      this.setState({error: 'Username is missing'});
    } else if (password === undefined || password === null) {
      this.setState({error: 'Password is missing'});
    } else  {
      this.props.signIn(username, password);
    }
  }

  
}
