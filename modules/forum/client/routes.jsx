import { Router, Route, IndexRoute } from 'react-router';
import App from './app';
import Main from './main';
import Landing from './landing';
import AppWrapper from './app_wrapper';

export default (
  <Route component={AppWrapper} >
    <Route path="/" component={Landing}/>
    <Route path="/" component={App}>
      <Route path="forum" component={Main} />
      <Route path="forum/:thread" component={Main} />
    </Route>
  </Route>
);

