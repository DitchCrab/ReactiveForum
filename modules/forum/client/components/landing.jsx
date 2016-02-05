import { Component, PropTypes } from 'react';
// Components
import Helmet from 'react-helmet';
import RaisedButton from 'material-ui/lib/raised-button';
// Styles
import ComponentStyle from '../styles/landing';
import Prefixer from 'inline-style-prefixer';
const prefixer = new Prefixer();
//Helpers
import Meta from 'forum/client/utils/meta';

/**
* Landing page component
*/
export default class Landing extends Component {
  static contextTypes = {
    history: PropTypes.object // Router history
  };

  constructor(props, context) {
    super(props);
    this.context = context;
    this.redirect = this.redirect.bind(this);
  }

  render() {
    // Set meta tags 
    const description = 'Open forum';
    const image = require('forum/client/img/bgM.jpg');
    const path = '/';
    const meta = Meta(path, description, image);
    return (
      <div style={prefixer.prefix(ComponentStyle.wrapper)}>
        <Helmet
            title="Forum"
            meta={meta}
        />
        <div style={ComponentStyle.nav}>
          <h1>DitchCrab</h1>
        </div>
        <div style={ComponentStyle.main}>
          <p>Don't know where to whin?</p>
          <br/>
          <RaisedButton label="Punch here" style={prefixer.prefix(ComponentStyle.button)} primary={true} onClick={this.redirect}/>
        </div>
      </div>
    );
  }

  redirect() {
    this.props.history.pushState(null, '/forum');
  }
};

