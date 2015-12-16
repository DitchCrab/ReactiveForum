import { Component, PropTypes} from 'react';
import ReactMixin from 'react-mixin';
import { FlatButton } from 'material-ui';
import Dialog from 'material-ui/lib/dialog';
import Wrapper from './thread/wrapper';
import LeftWrapper from './left/left_wrapper';
import ThreadUsers from './right/thread_users';
import ThreadForm from './widgets/thread_form';
import Categories from 'forum/collections/categories';
import ThreadImgs from 'forum/collections/thread_imgs';
import moment from 'moment';

@ReactMixin.decorate(ReactMeteorData)
export default class Main extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {showDialog: false, newThread: {}};
    this.selectCategory = this.selectCategory.bind(this);
    this.searchThreads = this.searchThreads.bind(this);
    this.viewThread = this.viewThread.bind(this);
    this.renderNav = this.renderNav.bind(this);
    this.renderFriendList = this.renderFriendList.bind(this);
    this.setGeneralUser = this.setGeneralUser.bind(this);
    this.renderNewThread = this.renderNewThread.bind(this);
    this._openDialog = this._openDialog.bind(this);      
    this._closeDialog = this._closeDialog.bind(this);
    this._cancelForm = this._cancelForm.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this.editNewThread = this.editNewThread.bind(this);
  }

  getMeteorData() {
    return {
      categories: Categories.find().fetch(),
      user: Meteor.user()
    }
  }
  
  componentWillMount() {
    Tracker.autorun(() => {
      if (Session.get('openNewThreadDialog') && !this.state.showDialog) {
        this._openDialog();
        Session.set('openNewThreadDialog', null);
      }
    })
  }

  componentDidMount() {
    Session.set('viewThread', this.props.params.thread)
  }

  render() {
    Session.set('viewThread', this.props.params.thread);
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let nav = this.renderNav();
    let friend_list = this.renderFriendList();

    return (
      <section className="s-grid-top">
        { w_w >= 640 ? nav : null }
        <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-md-6 s-grid-cell-lg-7">
          <Wrapper viewThread={this.viewThread} category={this.state.category}/>
        </div>
        { w_w >= 640 ? friend_list : null }
        { this.data.user ? this.renderNewThread() : null }
      </section>
    )
  }

  renderNav() {
    return (
      <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-md-3 s-grid-cell-lg-3">
        <LeftWrapper onSelectCategory={this.selectCategory} onSearch={this.searchThreads} viewThread={this.viewThread}/>
      </div>
    )
  }

  renderFriendList() {
    return (
      <div className="s-grid-cell s-grid-cell-sm-12 s-grid-cell-md-3 s-grid-cell-lg-2">
        <ThreadUsers onGeneralUser={this.setGeneralUser}/>
      </div>
    )
  }

  renderNewThread() {
    let customActions = [
      <FlatButton
          className="thread-form-cancel"
          key="1"
          label="Cancel"
          secondary={true}
          onTouchTap={this._cancelForm} />,
      <FlatButton
          className="thread-form-submit"
          key="2"
          label="Submit"
          primary={true}
          onTouchTap={this._submitForm} />
    ];
    return (
      <Dialog
          title="Create new thread"
          actions={customActions}
          actionFocus="submit"
          open={this.state.showDialog}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onRequestClose={this._closeDialog}>
        <ThreadForm categories={this.data.categories} threadParams={this.state.newThread} onEdit={this.editNewThread}/>
      </Dialog>
    )
  }    

  selectCategory(id) {
    Session.set('category', id);
  }

  searchThreads(params) {
    Session.set('search', params);
  }

  viewThread(id) {
    Session.set('viewThread', id);
    this.props.history.pushState(null, `/forum/${id}`);
  }

  setGeneralUser(id) {
    Session.set('onGeneralUser', id);
  }

  _openDialog() {
    this.setState({showDialog: true});
  }

  _closeDialog() {
    console.log("yes");
    this.setState({showDialog: false});
  }

  _cancelForm() {
    this.setState({newThread: {}, showDialog: false});
  }

  _submitForm() {
    ThreadImgs.insert(this.state.newThread.img, (err, imgObj) => {
      let params = this.state.newThread;
      params['imgId'] = imgObj._id;
      params.commends = [];
      Meteor.call('createThread', params, (err, res) => {
        this.setState({newThread: {}, showDialog: false});                          
      })
    });
  }

  editNewThread(key, value) {
    let thread_params = this.state.newThread;
    thread_params[key] = value;
    this.setState({newThread: thread_params});
  }
};

Main.contextTypes = {
  history: PropTypes.object.isRequired
};

