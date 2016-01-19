import configureStore from './configureStore';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

const Store = (function() {
  var store;
  return {
    getStore: function() {
      if (!store) {
         store = configureStore();
      }
      return store;
    }
  }
})();

export default Store;
