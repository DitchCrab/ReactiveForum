import { combineReducers } from 'redux';
import session from './session';
import { authError, createThreadError } from './errors';
import featuredUsers from './featured_users';
import onUser from './on_user';
import categories from './categories';
import browsingThreads from './browsing_threads';
import featuredThreads from './featured_threads';
import userThreads from './user_threads';
import { usersObserver, browsingObserver } from './observers';
import { newCommentId, newReplyHash } from './notifications';

export default combineReducers({
  session,
  authError,
  featuredUsers,
  onUser,
  categories,
  browsingThreads,
  featuredThreads,
  userThreads,
  usersObserver,
  browsingObserver,
  newCommentId,
  newReplyHash,
  createThreadError,
});
