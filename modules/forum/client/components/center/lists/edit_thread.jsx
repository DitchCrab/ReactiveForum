import { connect } from 'react-redux';
import { Component, PropTypes } from 'react';
// Components
import ThreadForm from './thread_form';
// Collections
import Threads from 'forum/collections/threads';
// Redux actions
import * as ThreadActions from 'forum/client/actions/thread';
import { pushPath } from 'redux-simple-router';
import { bindActionCreators } from 'redux';

/**
 * EditThread component
 * Wrapper for path 'forum/edit_thread/:id'
 * Include ThreadForm to handle user inputs
 */
export class EditThread extends Component {
  static propTypes = {
    // Thread categories from db
    categories: PropTypes.arrayOf(PropTypes.object),
    createThreadError: PropTypes.string,
    actions: PropTypes.shape({
      pushPath: PropTypes.func,
      editThread: PropTypes.func
    })
  };

  static defaultProps = {
    categories: [],
  };

  constructor(props, context) {
    super(props);
    this.state = {thread: {}};
  }

  componentDidMount() {
    this.setState({thread: Threads.findOne({_id: this.props.params.id})});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.setState({thread: Threads.findOne({_id: nextProps.params.id})});
    }
  }

  render() {
    return (
      <ThreadForm
          header="Edit thread"
          thread={this.state.thread}
          categories={this.props.categories}
          error={this.props.createThreadError}
          pushPath={this.props.actions.pushPath}
          submitThread={this.props.actions.editThread.bind(null, this.state.thread._id)} />
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
export default connect(mapStateToProps, mapDispatchToProps)(EditThread);
