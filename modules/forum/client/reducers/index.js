import { combineReducers } from 'redux';
import session from './session';
import { authError, createThreadError, searchError } from './errors';
import onUser from './on_user';
import categories from './categories';
import { browsingOpened, browsingThreads, browsingLimit, browsingQuery, hasMoreBrowsing } from './browsing_threads';
import featuredThreads from './featured_threads';
import userThreads from './user_threads';
import { newCommentId, newReplyHash } from './notifications';
import { thread, onReplying } from './thread';
import { windowSize } from './window';
import { viewedThreads } from './viewed_thread';
import { threadUserList } from './thread_user_list';
import { blacklist } from './blacklist';
import { sideNavOpened } from './side_nav'; 
import { routeReducer } from 'redux-simple-router';

export default combineReducers(Object.assign({}, {
  windowSize,
  session,
  authError,
  onUser,
  categories,
  browsingOpened,
  browsingThreads,
  browsingLimit,
  browsingQuery,
  hasMoreBrowsing,
  searchError,
  featuredThreads,
  userThreads,
  newCommentId,
  newReplyHash,
  createThreadError,
  thread,
  onReplying,
  viewedThreads,
  blacklist,
  sideNavOpened,
  threadUserList
}, {routing: routeReducer}));
