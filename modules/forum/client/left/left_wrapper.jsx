import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { CircularProgress, ListItem, TextField, List, IconButton, Styles } from 'material-ui';
import { ContentAdd } from 'material-ui/lib/svg-icons';
import ThreadList from './thread_list';
import Immutable from 'immutable';
import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';
const { Colors } = Styles;

@ReactMixin.decorate(ReactMeteorData)
export default class LeftWrapper extends Component {
  constructor(props, context) {
    super(props);
    this.state = {filterParams: {}};
    this.selectCategory = this.selectCategory.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.searchThreadsByEnter = this.searchThreadsByEnter.bind(this);
    this.renderNewThread = this.renderNewThread.bind(this);
    this._openDialog = this._openDialog.bind(this);
  }

  getMeteorData() {
    if (this.state.filterParams) {
      var threads = Threads.find(this.state.filterParams, {sort: {createdAt: -1}}).fetch();
    } else {
      var threads = Threads.find({}, {sort: {createdAt: -1}}).fetch();      
    }
    return {
      categories: Categories.find().fetch(),
      threads: threads,
      user: Meteor.user()
    }
  }
  
  componentWIllUpdate() {
    if (this.data.threads.length < 1 && Session.get('search')) {
      this.setState({searchError: `Sorry, no post found with "${Session.get('search')}"`});
      Meteor.setTimeout(() => {Session.set('search', null)}, 1000);
    } else {
      this.setState({searchError: null});
    }
  }

  componentWillMount() {
    Tracker.autorun(() => {
      var params = {};
      if (Session.get('category')) {
        params = {category: Session.get('category')};
      }
      
      var search_param = {};
      if (Session.get('search')) {
        let  tags = Immutable.fromJS(Session.get('search').split(' ')).map(x => x.trim()).toArray();
        search_param = {tags: {$all: tags}};
      }

      this.setState({filterParams: _.extend(params, search_param)});
    });
  }

  render() {
    if (this.data.categories == undefined) {
      return <CircularProgress mode="indeterminate" />
    }
    let list = this.data.categories.map((category, index) => {
      let style = {};
      if (category._id === this.state.categorySelected) {
        style['color'] = 'red';
      }
      return (
        <ListItem key={index} style={style} primaryText={category.name} onClick={this.selectCategory.bind(null, category._id)}/>
      )
    });
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
    const wrapper_style = {
      height: `${w_h}px`,
      overflowY: "auto"
    };
    return (
      <div>
        <div className="left-nav-fix" style={wrapper_style}>
          <TextField
              hintText="Search" style={{width: "200px"}} onBlur={this.clearSearch} onKeyUp={this.searchThreadsByEnter} errorText={this.state.searchError}/>
          <div>
            <List>
              {list}
            </List>
          </div>
          <ThreadList threads={this.data.threads} viewThread={this.props.viewThread.bind(null)}/>
        </div>
        {this.data.user ? this.renderNewThread() : null }
      </div>
    )
  }

  renderNewThread() {
    return (
      <div style={{position: "fixed", bottom: "10px", left: "10px" }}>
        <IconButton style={{backgroundColor: "rgba(244, 67, 54, 1)", borderRadius: "50%", marginLeft: "auto", marginRight: "auto", display: "block"}} onClick={this._openDialog}>
          <ContentAdd color={Colors.white}/>
        </IconButton>
      </div>
    )
  }

  _openDialog() {
    Session.set('openNewThreadDialog', true);
  }

  clearSearch(event) {
    event.preventDefault();
    event.target.value = '';
  }

  searchThreadsByEnter(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.props.onSearch.bind(null, event.target.value)();
    }
  }

  selectCategory(id) {
    this.props.onSelectCategory.bind(null, id)();
    this.setState({categorySelected: id});
  }

};

LeftWrapper.propTypes = {
  viewThread: PropTypes.func,
  onSearch: PropTypes.func,
  onSelectCategory: PropTypes.func
}
