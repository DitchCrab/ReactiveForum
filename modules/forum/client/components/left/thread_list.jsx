import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Components
import { Card, CardMedia, CardTitle, IconButton, FlatButton, Styles } from 'material-ui';
import { ContentFlag, ToggleStar, CommunicationComment } from 'material-ui/lib/svg-icons';
import ComponentStyle from '../../styles/left/thread_list';
const { Colors } = Styles;

export default  class ThreadList extends Component {
  static propTypes = {
    browsingOpened: PropTypes.bool,
    thread: PropTypes.object,
    // List of thread queried
    threads: PropTypes.arrayOf(PropTypes.object),
    // When user signed in
    currentUser: PropTypes.object,
    // Callback on click on thread card
    viewThread: PropTypes.func.isRequired,
    openSnackbar: PropTypes.func,
    likeThread: PropTypes.func,
    flagThread: PropTypes.func,
    unflagThread: PropTypes.func
  };

  static defaultProps = {
    threads: []
  };

  constructor(props, context) {
    super(props);
    // Decoupling from main render function
    this.renderEachThread = this.renderEachThread.bind(this);
    // Server calls
    this.likeThread = this.likeThread.bind(this);
    this.flagThread = this.flagThread.bind(this);
    this.unflagThread = this.unflagThread.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
    this.editThread = this.editThread.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const same_view = this.props.browsingOpened === nextProps.browsingOpened;
    const same_user = _.isEqual(this.props.currentUser, nextProps.currentUser);    
    const same_threads = _.isEqual(this.props.threads, nextProps.threads);
    if (same_view && same_user && same_threads) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate(preProps) {
    if (this.props.windowSize === 'small' && this.props.thread) {
      if (!preProps.browsingOpened && this.props.browsingOpened) {
        const thread = ReactDOM.findDOMNode(this.refs[this.props.thread._id]);
        thread.scrollIntoView();
      }
    }
  }

  render() {
    let cards = this.props.threads.map(thread => this.renderEachThread(thread));
    return (
      <div>
        {cards}
      </div>
    )
  }

  renderEachThread(thread) {
    let user = this.props.currentUser;
    let sub_des = thread.description.split(' ');
    var des;
    if (sub_des.length > 20) {
      des = sub_des.slice(0, 20).join(' ') + '...(more)';
    } else {
      des = thread.description;
    }
    let button = null;
    if (user) {
      button = thread.user._id === this.props.currentUser._id ? <FlatButton style={ComponentStyle.button} label="Edit" onClick={this.editThread.bind(null, thread._id)}/> : null;
    }
    return (
      <Card key={thread._id} ref={thread._id} style={ComponentStyle.card}  onClick={this.props.viewThread.bind(null, thread._id)}>
        <CardMedia>
          <img src={(thread.imgUrl)} style={thread.imgUrl ? ComponentStyle.img : null }/>
        </CardMedia>
        <CardTitle title={thread.title} subtitle={<p style={ComponentStyle.description}>{des}</p>}/>
        <div style={ComponentStyle.cardAction}>
          { button }
          <IconButton touch={true} onClick={this.likeThread.bind(null, thread._id)} >
            <ToggleStar/>
          </IconButton>
          <div className="thread-like" style={ComponentStyle.textDiv}>{thread.likes}</div>                              
          <IconButton touch={true}>
            <CommunicationComment/>
          </IconButton>
          <div className="thread-comment" style={ComponentStyle.textDiv}>{thread.comments ? thread.comments.length: null }</div>
          {this.renderFlag(user, thread._id)}
          <div style={ComponentStyle.noDiv} />
        </div>
      </Card>          
    )
  }
  
  renderFlag(user, id) {
    if (!user) {
      return;
    }
    if (user.profile) {
      if (user.profile.flags) {
        if (_.find(user.profile.flags, (flag) => { return flag == id;})) {
          return (
            <IconButton touch={true} onClick={this.unflagThread.bind(null, id)}>
              <ContentFlag color={Colors.yellow800}/>
            </IconButton>
          )
        }
      }
    }
    return (
      <IconButton touch={true} onClick={this.flagThread.bind(null, id)} ><ContentFlag/></IconButton>
    )
  }

  likeThread(id, e) {
    e.stopPropagation();
    if (this.props.currentUser) {
      this.props.likeThread(id);
    } else {
      this.props.openSnackbar();
    }
  }

  flagThread(id, e) {
    e.stopPropagation();
    if (this.props.currentUser) {
      this.props.flagThread(id);
    } else {
      this.props.openSnackbar();
    }
  }

  unflagThread(id, e) {
    e.stopPropagation();
    if (this.props.currentUser) {
      this.props.unflagThread(id);
    } else {
      this.props.openSnackbar();
    }
  }

  editThread(id, e) {
    e.stopPropagation();
    this.props.pushPath(`/forum/edit_thread/${id}`);
  }

};

