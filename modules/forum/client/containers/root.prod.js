import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Store from '../store/create_store';

export default class Root extends Component {
  componentWillMount() {
    this.featuredThreadsHandler = Meteor.subscribe('featured-threads');
    this.userThreadsHandler = Meteor.subscribe('user-threads');
    this.viewingThreadHandler = Meteor.subscribe('viewing-threads');
    this.browsingHandler = Meteor.subscribe('browsing-threads');
    this.imgHandler = Meteor.subscribe('threadImgs');
    this.avatarHandler = Meteor.subscribe('userAvatars');
  }

  componentWillUnmount() {
    this.featuredThreadsHandler.stop(); 
    this.userThreadsHandler.stop();
    this.viewingThreadHandler.stop();
    this.browsingHandler.stop();
    this.imgHandler.stop();
    this.avatarHandler.stop();
  }

  render() {
    return (
      <Provider store={Store.getStore()}>
      {this.props.children}
      </Provider>
    );
  }
}
