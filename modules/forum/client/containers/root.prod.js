import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store/create_store';

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
      {this.props.children}
      </Provider>
    );
  }
}
