import { Component, PropTypes } from 'react';
// Components
import Helmet from 'react-helmet';
import RaisedButton from 'material-ui/lib/raised-button';
// STyles
import { Styles } from 'material-ui';
import ComponentStyle from '../styles/landing';
const { AutoPrefix } = Styles;

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
    const meta = [
      {name: 'description', content: 'Open forum'},
      {name: 'keywords', content: 'crab'},
      {charset: 'UFT-8'},
      //Open graph
      {property: 'og:title', content: 'Forum'},
      {property: 'og:type', content: 'landing page'},
      {property: 'og:url', content: 'my url'},
      {property: 'og:image', content: 'bg_img'},
      {property: 'og:description', content: 'Open forum'},
      {property: 'og:site_name', content: 'My website'},
      //Twitter
      {name: 'twitter:card', content: 'bg_img'},
      {name: 'twitter:site', content: '@twitter_url'},
      {name: 'twitter:title', content: 'Forum'},
      {name: 'twitter:description', content: 'Open forum'},
      {name: 'twitter:image:src', content: 'bg_img'},
      // Google plus
      {itemprop: 'name', content: 'Forum'},
      {itemprop: 'description', content: 'Open forum'},
      {itemprop: 'image', content: 'bg_img'}
    ];
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

