import { Component, PropTypes } from 'react';
import { Card, CardMedia, CardTitle, IconButton, Styles } from 'material-ui';
import { ContentFlag, ToggleStar, CommunicationComment } from 'material-ui/lib/svg-icons';
const { Colors } = Styles;

export default  class ThreadList extends Component {
  static propTypes = {
    threads: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func
  }

  static defaultProps = {
    threads: []
  }

  constructor(props, context) {
    super(props);
    this.renderEachThread = this.renderEachThread.bind(this);
    this.likeThread = this.likeThread.bind(this);
    this.flagThread = this.flagThread.bind(this);
    this.unflagThread = this.unflagThread.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
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
    return (
      <Card key={thread._id} style={{marginBottom: 12}}  onClick={this.props.viewThread.bind(null, thread._id)}>
        <CardMedia>
          <img src={(thread.imgUrl)} />
        </CardMedia>
        <CardTitle title={thread.title} subtitle={thread.description}/>
        <div style={{textAlign: 'right'}}>
          <IconButton touch={true} onClick={this.likeThread.bind(null, thread._id)} >
            <ToggleStar/>
          </IconButton>
          <div className="thread-like" style={{display: 'inline-block',fontSize: '80%'}}>{thread.likes}</div>                              
          <IconButton touch={true} >
            <CommunicationComment/>
          </IconButton>
          <div className="thread-comment" style={{display: 'inline-block',fontSize: '80%'}}>{thread.comments ? thread.comments.length: null }</div>
          {this.renderFlag(user, thread._id)}
        </div>
      </Card>          
    )
  }
  
  renderFlag(user, id) {
    if (!user) {
      return <div/>
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
    Meteor.call('likeThread', id, (err, result) => {
    })
  }

  flagThread(id, e) {
    e.stopPropagation();
    Meteor.call('flagThread', id, (err, result) => {
    })
  }

  unflagThread(id, e) {
    e.stopPropagation();
    Meteor.call('unflagThread', id, (err, result) => {
    })
  }

};

