import { Component } from 'react';
import { TextField, RaisedButton, FlatButton } from 'material-ui';
import ComponentStyle from 'forum/client/styles/right/login';

export default class Login extends Component {
  constructor(props, context) {
    super(props);
    this.state = {username: null, password: null};
    this.getLoginInfo = this.getLoginInfo.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.userSignup = this.userSignup.bind(this);
  }

  render() {
    return (
      <div style={ComponentStyle.wrapper}>
        <p style={ComponentStyle.error}>{this.state.error}</p>
        <TextField
            hintText="Username" value={this.state.username} onChange={this.getLoginInfo.bind(null, 'username')} />
        <TextField
            hintText="Password" type="password" value={this.state.password} onChange={this.getLoginInfo.bind(null, 'password')} />
        <RaisedButton primary={true} label="Sign In" style={ComponentStyle.loginButton} onClick={this.userLogin}/>
        <br/>
        <FlatButton label="Sign up" onClick={this.userSignup}/>
      </div>
    )
  }

  getLoginInfo(key, event) {
    event.preventDefault();
    let pair = {};
    pair[key] = event.target.value;
    this.setState(pair);
  }

  userLogin() {
    let {username, password} = this.state;
    if (username === undefined || username === null) {
      this.setState({error: 'Username is missing'});
    } else if (password === undefined || password === null) {
      this.setState({error: 'Password is missing'});
    } else  {
      Meteor.loginWithPassword(username, password, (err, res) => {
        if (err) {
          if (err.error === 403) {
            this.setState({error: 'Please sign up'});              
          }
        }
        console.log({res: res});
        console.log({err: err});
      })
    }
  }

  userSignup() {
    let {username, password} = this.state;
    if (username === undefined || username === null) {
      this.setState({error: 'Username is missing'});
    } else if (password === undefined || password === null) {
      this.setState({error: 'Password is missing'});
    } else  {
      Accounts.createUser({username: username, password: password}, (err, res) => {
        if (err) {
          if (err.error === 403) {
            this.setState({error: 'User exists'});
          }
        } else {
          this.setState({username: null, password: null});
        }
      })
    }
  }
};
