import { Component, PropTypes } from 'react';
import { GridList, RaisedButton } from 'material-ui';
import ComponentStyle from 'forum/client/styles/landing';

export default class Landing extends Component {
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props);
    this.context = context;
    this.redirect = this.redirect.bind(this);
  }

  render() {
    var bg = require('./img/bgL.jpg');
    return (
      <div style={ComponentStyle.wrapper}>
        <div style={ComponentStyle.nav}>
          <h1>DitchCrab</h1>
        </div>
        <div style={ComponentStyle.main}>
          <p>Don't know where to whin after a shitty day?</p>
          <br/>
          <RaisedButton label="Punch here" style={ComponentStyle.button} primary={true} onClick={this.redirect}/>
        </div>
      </div>
    );
  }

  redirect() {
    this.props.history.pushState(null, '/forum');
  }
};

