import { Router, Route, IndexRoute } from 'react-router';
import App from './components/app';
import Main from './components/main';
import Landing from './components/landing';
import Features from './components/center/lists/featured';
import User from './components/center/lists/user';
import Thread from './components/center/thread/thread';
import ThreadForm from './components/center/lists/thread_form';
import Root from './containers/root';
  
/* export default (
   <Route component={Root} >
   <Route path="/" component={Landing}/>
   <Route path="/" component={App}>
   <Route path="forum" component={Main} />
   <Route path="forum/:thread" component={Main} />
   </Route>
   </Route>
   ); */

export default (
  <Route component={Root} >
    <Route path="/" component={Landing}/>
    <Route path="/" component={App}>
      <Route path="forum" component={Main} >
        <IndexRoute component={Features}/>
        <Route path="create_thread" component={ThreadForm} />
        <Route path="user/:id" component={User}/>
        <Route path="thread/:id" component={Thread} />
      </Route>
    </Route>
  </Route>
);

