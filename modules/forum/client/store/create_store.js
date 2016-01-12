import configureStore from './configureStore';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

const store = configureStore();

export default store;
