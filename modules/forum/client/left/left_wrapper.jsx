import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { CircularProgress, ListItem, TextField, List, IconButton, Styles, DropDownMenu, MenuItem } from 'material-ui';
import { ContentAdd } from 'material-ui/lib/svg-icons';
import ThreadList from './thread_list';
import Immutable from 'immutable';
import InfiniteScroll from 'forum/client/widgets/infinite_scroll';
import ComponentStyle from 'forum/client/styles/left/left_wrapper';
const { Colors } = Styles;

export default class LeftWrapper extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    searchError: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.object),
    threads: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    increaseBrowsingLimit: PropTypes.func.isRequired,
    windowSize: PropTypes.string
  }

  static defaultProps = {
    categories: [],
    threads: []
  }
  
  constructor(props, context) {
    super(props);
    this.state = {filterParams: {}, hasMore: true, categoryValue: 1};
    this.renderCategory = this.renderCategory.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.searchThreadsByEnter = this.searchThreadsByEnter.bind(this);
    this.renderNewThread = this.renderNewThread.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this._openDialog = this._openDialog.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchError) {
      Meteor.setTimeout(() => {nextProps.resetSearch.bind(null)()}, 1000);
    }
    if (nextProps.threads.length - this.props.threads.length < 5) {
      this.setState({hasMore: false});
    }
  }

  componentDidMount() {
    if (this.props.windowSize !== 'small') {
      this.setState({parentLarge: ReactDOM.findDOMNode(this.refs.leftWrapper)});
    }
  }
  
  render() {
    const infinite_props = {
      pageStart: 0,
      loadMore: this.props.increaseBrowsingLimit,
      hasMore: this.state.hasMore,
      loader: <div/>,
      parentLarge: this.state.parentLarge
    };
    return (
      <div>
        <div ref="leftWrapper" style={ComponentStyle.wrapper(this.props.windowSize)}>
          <InfiniteScroll {...infinite_props}>
            <TextField
                hintText="Search" style={ComponentStyle.searchField}
                onBlur={this.clearSearch}
                onKeyUp={this.searchThreadsByEnter}
                errorText={this.props.searchError}/>
            <div>
              { this.renderCategory() }
            </div>
            <ThreadList
                currentUser={this.props.currentUser}
                threads={this.props.threads}
                viewThread={this.props.viewThread.bind(null)}/>
          </InfiniteScroll>
        </div>
        {this.props.currentUser ? this.renderNewThread() : null }
      </div>
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
        <IconButton style={ComponentStyle.newThreadButton} onClick={this._openDialog}>
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

  handleSelectCategory(e, index, value) {
    this.setState({categoryValue: value});
    this.props.onSelectCategory.bind(null, value)();
  }

};

