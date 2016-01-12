import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import DevTools from './dev_tools';
import store from '../store/create_store';

export default class Root extends Component {
  render() {
    return (
      <Provider store={this.store}>
      {this.props.children}
      </Provider>
    );
  }
}
