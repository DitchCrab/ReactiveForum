import { Component, PropTypes } from 'react';
// Components
import Helmet from 'react-helmet';
import RaisedButton from 'material-ui/lib/raised-button';
// STyles
import { Styles } from 'material-ui';
import ComponentStyle from '../styles/landing';
const { AutoPrefix } = Styles;
//Helpers
import Meta from 'forum/client/meta';

// Render landing page view
export default class Landing extends Component {
  static contextTypes = {
    history: PropTypes.object
  };

  constructor(props, context) {
    super(props);
    this.context = context;
    this.redirect = this.redirect.bind(this);
  }

  render() {
    // Meta tags
    const description = 'Open forum';
    const image = require('forum/client/img/bgM.jpg');
    const path = '/';
    const meta = Meta(path, description, image);
    return (
      <div style={AutoPrefix.all(ComponentStyle.wrapper)}>
        <Helmet
            title="Forum"
            meta={meta}
        />
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

