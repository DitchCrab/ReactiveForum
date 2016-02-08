import { Router, Route } from 'react-router';
import forumRoutes from 'forum/client/routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Store from 'forum/client/store/create_store';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

var history;
if (Meteor.isClient) {
  history = createHistory();
  syncReduxAndRouter(history, Store.getStore());
  injectTapEventPlugin();
}

if (Meteor.isServer) {
  Meteor.onConnection(function(obj) {
    global.navigator = {
      userAgent: obj.httpHeaders['user-agent']
    }
  });
}

ReactRouterSSR.Run(
  forumRoutes,
  {props: {history: history}}
);

