import { Route } from 'react-router';
import forumRoutes from 'forum/client/routes';
ReactRouterSSR.Run(
  <Route>
    {forumRoutes}
  </Route>
);
