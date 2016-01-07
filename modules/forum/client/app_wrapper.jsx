import { Component, PropTypes } from 'react';

import { createStore } from 'redux';
import forum from 'forum/client/reducers';

let store = createStore(forum);

export default class AppWrapper extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };
  
  static childContextTypes = {
    store: PropTypes.object.isRequired
  };

  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context);
    this.store = store;
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.store, nextProps.store)) {
      console.warn(nextProps.store);
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
