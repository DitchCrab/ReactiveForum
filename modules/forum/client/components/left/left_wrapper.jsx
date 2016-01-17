import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Components
import { CircularProgress, ListItem, TextField, List, IconButton, Styles, DropDownMenu, MenuItem } from 'material-ui';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import { ContentAdd } from 'material-ui/lib/svg-icons';
import ThreadList from './thread_list';
import InfiniteScroll from '../widgets/infinite_scroll';
import ComponentStyle from '../../styles/left/left_wrapper';
const { Colors, AutoPrefix } = Styles;

export default class LeftWrapper extends Component {
  static propTypes = {
    // If user signed in
    currentUser: PropTypes.object,
    // If there's no search result
    searchError: PropTypes.string,
    // List of thread categories from db
    categories: PropTypes.arrayOf(PropTypes.object),
    // List of threads queried
    threads: PropTypes.arrayOf(PropTypes.object),
    // Callback when user click thread card
    viewThread: PropTypes.func.isRequired,
    windowSize: PropTypes.string,
    // Important for infinite scrolling. Default is 'false' if no more threads to scroll
    hasMoreBrowsing: PropTypes.bool,
    // Default to 10 threads. Add 10 subsequently
    browsingLimit: PropTypes.number,
    // Set to false at scroll threshold to stop subscription to scoll event
    // Set to true when there is more threads
    setHasMoreBrowsing: PropTypes.func,
    setBrowsingLimit: PropTypes.func,
    // Set different query for threads based on category or search query
    setBrowsingQuery: PropTypes.func,
    // If there is search error, reset search
    resetSearch: PropTypes.func,
    pushPath: PropTypes.func,
    openSnackbar: PropTypes.func,
    likeThread: PropTypes.func,
    flagThread: PropTypes.func,
    unflagThread: PropTypes.func
  };

  static defaultProps = {
    categories: [],
    threads: []
  };
  
  constructor(props, context) {
    super(props);
    this.state = {
      // Store the select value of category
      categoryValue: 1
    };
    // Decoupling from main render methods
    this.renderCategory = this.renderCategory.bind(this);
    this.renderInfinite = this.renderInfinite.bind(this);
    // Render fab button to trigger New Thread Form Dialog onClick
    this.renderNewThread = this.renderNewThread.bind(this);
    // Fire where no sesults from search
    this.clearSearch = this.clearSearch.bind(this);
    this.searchThreadsByEnter = this.searchThreadsByEnter.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Evaluate if there is search result. Else clear search query
    if (nextProps.searchError) {
      Meteor.setTimeout(() => {nextProps.resetSearch()}, 1000);
    }
  }

  componentDidMount() {
    // On medium and large screen, identify overflow dom element to bind scroling event
    if (this.props.windowSize !== 'small') {
      this.setState({parentLarge: ReactDOM.findDOMNode(this.refs.leftWrapper)});
    }
  }
  
  render() {
    return (
      <div>
        <div ref="leftWrapper" style={ComponentStyle.wrapper(this.props.windowSize)}>
          { this.props.windowSize === 'small' || this.state.parentLarge ? this.renderInfinite() : null }
        </div>
        {this.props.currentUser ? this.renderNewThread() : null }
      </div>
    )
  }

  renderInfinite() {
    let infinite_props = {
      pageStart: 0,
      loadMore: this.loadMore,
      hasMore: this.props.hasMoreBrowsing,
      loader: <RefreshIndicator size={40} left={80} top={5} status="loading" />,
    };
    if (this.props.windowSize !== 'small') {
      infinite_props.parentLarge = this.state.parentLarge;
    }
    return (
      <InfiniteScroll {...infinite_props}>
        <TextField
            hintText="Search" style={ComponentStyle.searchField}
            onBlur={this.clearSearch}
            onKeyUp={this.searchThreadsByEnter}
            errorText={this.props.searchError}/>
        <div style={ComponentStyle.dropDownDiv}>
          <p style={ComponentStyle.dropDownHeader}>Select category:</p>
          { this.renderCategory() }
        </div>
        <ThreadList
            currentUser={this.props.currentUser}
            threads={this.props.threads}
            openSnackbar={this.props.openSnackbar}
            likeThread={this.props.likeThread}
            flagThread={this.props.flagThread}
            unflagThread={this.props.unflagThread}
            viewThread={this.props.viewThread.bind(null)}
            pushPath={this.props.pushPath}/>
      </InfiniteScroll>
    )
  }
  
  renderCategory(category, index) {
    const categories = this.props.categories.map((category) => {
      return (
        <MenuItem
            key={category._id}
            value={category._id}
            primaryText={category.name} />
      )
    });
    
    if (this.props.currentUser) {
      return (
        <DropDownMenu
            value={this.state.categoryValue}
            onChange={this.handleSelectCategory} style={ComponentStyle.dropDownCategory}>
          <MenuItem key={1} value={1} primaryText="All" />
          <MenuItem key={2} value={2} primaryText="Flagged" />
          <MenuItem key={3} value={3} primaryText="My threads" />
          {categories}
        </DropDownMenu>
      )
    } else {
      return (
        <DropDownMenu
            value={this.state.categoryValue}
            onChange={this.handleSelectCategory}
            style={ComponentStyle.dropDownCategory}>
          <MenuItem key={1} value={1} primaryText="All" />
          {categories}
        </DropDownMenu>
      )
    }
  }
  
  renderNewThread() {
    return (
      <div style={ComponentStyle.newThreadDiv}>
        <IconButton style={AutoPrefix.all(ComponentStyle.newThreadButton)} onClick={this.props.pushPath.bind(null, '/forum/create_thread')}>
          <ContentAdd color={Colors.white}/>
        </IconButton>
      </div>
    )
  }

  clearSearch(event) {
    event.preventDefault();
    event.target.value = '';
  }

  searchThreadsByEnter(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      let search = event.target.value;
      let tags = _.map(search.split(' '), x => x.trim());
      let query = {tags: {$all: tags}};
      this.props.setBrowsingQuery(query);
    }
  }

  handleSelectCategory(e, index, value) {
    this.setState({categoryValue: value, hasMore: true});
    const limit = 10;
    let query = {};
    switch (value) {
      // Hardcode id as 1. search all threads
      case 1:
        break;
     // Hardcode id as 2. Search flag threads stored in user profile
      case 2:
        query = {_id: {$in: this.props.currentUser.profile ? this.props.currentUser.profile.flags : []}};
        break;
      case 3:
        query = {"user._id": this.props.currentUser._id};
        break;
      default:
        query = {category: value};
    }
    this.props.setBrowsingLimit(10);
    this.props.setBrowsingQuery(query);
  }

  loadMore() {
    const limit = this.props.browsingLimit + 10;
    this.props.setHasMoreBrowsing(false);
    this.props.setBrowsingLimit(limit);
  }

};

