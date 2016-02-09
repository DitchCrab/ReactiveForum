import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Components
import { Card, CardMedia, CardTitle, IconButton, FlatButton, Styles } from 'material-ui';
import { ContentFlag, ToggleStar, CommunicationComment } from 'material-ui/lib/svg-icons';
// Style
import ComponentStyle from '../../styles/left/thread_list';
const { Colors } = Styles;

/**
* ThreadList component
* Responsible for rendering threads in card list
*/
export default  class ThreadList extends Component {
  static propTypes = {
    browsingOpened: PropTypes.bool,
    thread: PropTypes.object, // Current thread on center. On small screen, use to scroll to the right position of last browsing
    threads: PropTypes.arrayOf(PropTypes.object),     // List of thread queried
    currentUser: PropTypes.object, // User signed in object
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
    this.renderEachThread = this.renderEachThread.bind(this);
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

  // In small screen, move to previous clicked thread
  componentDidUpdate(preProps) {
    if (this.props.windowSize === 'small' && this.props.thread) {
      if (!preProps.browsingOpened && this.props.browsingOpened) {
        let thread = ReactDOM.findDOMNode(this.refs[this.props.thread._id]);
        if (thread) {
          thread.scrollIntoView();
        }
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
    const user = this.props.currentUser;
    let sub_des = thread.description.split(' ');
    let des = '';
    if (sub_des.length > 20) {
      des = sub_des.slice(0, 20).join(' ') + '...(more)';
    } else {
      des = thread.description;
    }
    let button = null;
    if (user) {  // If user created thread, show edit button
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

  /*
  * When user flag thread, it is added to their profiel
  * They can view their flaged thread by clicking on Flagged category
  */
  renderFlag(user, id) {
    let flag = <IconButton touch={true} onClick={this.flagThread.bind(null, id)} ><ContentFlag/></IconButton>;
    if (!user) {
      return flag;
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
    return flag;
  }

  // @params id {string} - threadId
  // @params e {object} - synthetic event
  likeThread(id, e) {
    e.stopPropagation();
    if (this.props.currentUser) {
      this.props.likeThread(id);
    } else {
      this.props.openSnackbar('Hi there, please log on to like');
    }
  }

  // @params id {string} - threadId
  // @params e {object} - synthetic event
  flagThread(id, e) {
    e.stopPropagation();
    if (this.props.currentUser) {
      this.props.flagThread(id);
    } else {
      this.props.openSnackbar('Hi there, please log on to flag and read later');
    }
  }

  // @params id {string} - threadId
  // @params e {object} - synthetic event
  unflagThread(id, e) {
    e.stopPropagation();
    if (this.props.currentUser) {
      this.props.unflagThread(id);
    } else {
      this.props.openSnackbar('Hi there, please log on to flag and read later');
    }
  }

  // @params id {string} - threadId
  // @params e {object} - synthetic event
  editThread(id, e) {
    e.stopPropagation();
    this.props.pushPath(`/forum/edit_thread/${id}`);
  }

};

