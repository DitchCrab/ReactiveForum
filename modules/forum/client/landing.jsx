import { Component, PropTypes } from 'react';
import { GridList, RaisedButton } from 'material-ui';

export default class Landing extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.redirect = this.redirect.bind(this);
  }

  render() {
    const height = window.innerHeight * 0.7;
    const centerStyle = {
      position: 'absolute',
      left: '50%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    };
    return (
      <div style={{backgroundImage: "url('bg.jpg')"}}>
        <GridList
            cols={1}
            style={{height: `${height}px`}}>
          <h1 id="heading-name" className="white">EXPAT HOME</h1>
        </GridList>
        <GridList
            cols={1}>
          <RaisedButton id="landing-discover" label="Discover" primary={true} style={centerStyle} onClick={this.redirect}/>
        </GridList>
      </div>
    );
  }

  redirect() {
    this.props.history.pushState(null, '/forum');
  }
};

Landing.contextTypes = {
  history: PropTypes.object.isRequired
};
