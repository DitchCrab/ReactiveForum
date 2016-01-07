import { Router, Route } from 'react-router';
import forumRoutes from 'forum/client/routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

ReactRouterSSR.Run(
  forumRoutes,
  injectTapEventPlugin()
);
