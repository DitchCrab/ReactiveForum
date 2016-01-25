import { connect } from 'react-redux';
import { Component, PropTypes } from 'react';
// Components
import ThreadForm from './thread_form';
// Redux actions
import * as ThreadActions from 'forum/client/actions/thread';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

/**
 * NewThread component
 * Wrapper for path 'forum/new_thread'
 * Include ThreadForm to handle user inputs
 */
export class NewThread extends Component {
  static propTypes = {
    // Thread categories from db
    categories: PropTypes.arrayOf(PropTypes.object),
    createThreadError: PropTypes.string,
    actions: PropTypes.shape({
      pushPath: PropTypes.func,
      createThread: PropTypes.func
    })
  };

  static defaultProps = {
    categories: [],
  };

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <ThreadForm
          header="New thread"
          thread={{}}
          categories={this.props.categories}
          error={this.props.createThreadError}
          pushPath={this.props.actions.pushPath}
          submitThread={this.props.actions.createThread} />
    )
  }
}


function mapStateToProps(state) {
  return {
    categories: state.categories,
    createThreadError: state.createThreadError,
  }
}

const actions = _.extend(ThreadActions, {pushPath: pushPath});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewThread);
