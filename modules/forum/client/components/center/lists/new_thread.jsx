import { connect } from 'react-redux';
import { Component, PropTypes } from 'react';
// Components
import ThreadForm from './thread_form';
// Redux actions
import {
  ThreadActions,
  SnackbarActions
} from 'forum/client/actions';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

/**
 * NewThread component
 * Wrapper for path 'forum/new_thread'
 * Include ThreadForm to handle user inputs
 */
export class NewThread extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object), // Thread categories
    createThreadError: PropTypes.string,
    currentUser: PropTypes.object,
    actions: PropTypes.shape({
      pushPath: PropTypes.func,
      createThread: PropTypes.func,
      openSnackbar: PropTypes.func
    })
  };

  static defaultProps = {
    categories: [],
  };

  constructor(props, context) {
    super(props);
    this.submitThread = this.submitThread.bind(this);
  }

  render() {
    return (
      <ThreadForm
          header="New thread"
          thread={{}}
          categories={this.props.categories}
          error={this.props.createThreadError}
          pushPath={this.props.actions.pushPath}
          submitThread={this.submitThread} />
    )
  }

  submitThread(params) {
    if (this.props.currentUser) {
      this.props.actions.createThread(params);
    } else {
      this.props.actions.openSnackbar('Sorry, you need to log on to post');
    }
  }
}


function mapStateToProps(state) {
  return {
    categories: state.categories,
    createThreadError: state.createThreadError,
    currentUser: state.session
  }
}

const actions = _.extend(ThreadActions, SnackbarActions, {pushPath: pushPath});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewThread);
