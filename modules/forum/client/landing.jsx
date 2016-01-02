import { Component, PropTypes } from 'react';
import { Styles } from 'material-ui';
import RaisedButton from 'material-ui/lib/raised-button';
import ComponentStyle from 'forum/client/styles/landing';
const { AutoPrefix } = Styles;

export default class Landing extends Component {
  static contextTypes = {
    history: PropTypes.object
  }

  constructor(props, context) {
    super(props);
    this.context = context;
    this.redirect = this.redirect.bind(this);
  }

  render() {
    return (
      <div style={AutoPrefix.all(ComponentStyle.wrapper)}>
        <div style={ComponentStyle.nav}>
          <h1>DitchCrab</h1>
        </div>
        <div style={ComponentStyle.main}>
          <p>Don't know where to whin after a shitty day?</p>
          <br/>
          <RaisedButton label="Punch here" style={AutoPrefix.all(ComponentStyle.button)} primary={true} onClick={this.redirect}/>
        </div>
      </div>
    );
  }

  redirect() {
    this.props.history.pushState(null, '/forum');
  }
};

