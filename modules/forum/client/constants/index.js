export const WINDOW_SIZE = 'WINDOW_SIZE';
// User 'sign in', 'sign out' & 'edit profile'
export const USER_SESSION = 'USER_SESSION';
export const USER_SESSION_CHANGED = 'USER_SESSION_CHANGED';

// Clear error
export const AUTH_ERROR = 'AUTH_ERROR';
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';

// Query users with Meteor.users
export const GET_USER = 'GET_USER';

// Categories use to filter threads & create new thread
export const GET_CATEGORIES = 'GET_CATEGORIES';

// Browsing menu actions
export const OPEN_BROWSING = 'OPEN_BROWSING';
export const CLOSE_BROWSING = 'CLOSE_BROWSING';
// Query threads on specific action
export const SET_BROWSING_QUERY = 'SET_BROWSING_QUERY';
export const SET_BROWSING_LIMIT = 'SET_BROWSING_LIMIT';
export const BROWSING_THREADS = 'BROWSING_THREADS';
export const HAS_MORE_BROWSING = 'HAS_MORE_BROWSING';
export const SEARCH_ERROR = 'SEARCH_ERROR';
export const RESET_SEARCH = 'RESET_SEARCH';

export const GET_FEATURED_THREADS = 'GET_FEATURED_USERS';
export const GET_USER_THREADS = 'GET_USER_THREADS';

// Get thread
export const GET_THREAD = 'GET_THREAD';

// Get list of users contributed in thread
export const GET_THREAD_USER_LIST = 'GET_THREAD_USER_LIST';

// Update thread
export const LIKE_THREAD = 'LIKE_REPLY';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const LIKE_COMMENT = 'LIKE_COMMENT';
export const CREATE_REPLY = 'CREATE_REPLY';
export const UPDATE_REPLY = 'UPDATE_REPLY';
export const LIKE_REPLY = 'LIKE_REPLY';

// Update user profile
export const FLAG_THREAD = 'FLAG_THREAD';
export const UNFLAG_THREAD = 'UNFLAG_THREAD';

// Create new thread
export const CREATE_THREAD_ERROR = 'CREATE_THREAD_ERROR';
export const CLEAR_THREAD_ERROR = 'CLEAR_THREAD_ERROR';

// Threads that are viewed
export const ADD_VIEWED_THREAD = 'ADD_VIEWED_THREAD';

// Blacklist which filter user on view
export const BLACKLIST_USER = 'BLACKLIST_USER';
export const WHITELIST_USER = 'WHITELIST_USER';
export const BLACKLIST_ALL = 'BLACKLIST_ALL';
export const WHITELIST_ALL = 'WHITELIST_ALL';
