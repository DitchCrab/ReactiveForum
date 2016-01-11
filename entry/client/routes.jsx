import { Router, Route } from 'react-router';
import forumRoutes from 'forum/client/routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import store from 'forum/client/store/create_store';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

const history = createHistory();
syncReduxAndRouter(history, store);

ReactRouterSSR.Run(
  forumRoutes,
  {props: {history: history}},
  {props: {history: history}},
  injectTapEventPlugin()
);
