import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './dev_tools';
import configureStore from '../stores/configureStore';

const store = configureStore();

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          {this.props.children}
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
