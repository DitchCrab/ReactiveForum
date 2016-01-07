import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { CircularProgress, ListItem, TextField, List, IconButton, Styles, DropDownMenu, MenuItem } from 'material-ui';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import { ContentAdd } from 'material-ui/lib/svg-icons';
import ThreadList from './thread_list';
import InfiniteScroll from 'forum/client/widgets/infinite_scroll';
import ComponentStyle from 'forum/client/styles/left/left_wrapper';
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
    // Callbacks for query events
    onSearch: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    // Callback when scroll to the end
    increaseBrowsingLimit: PropTypes.func.isRequired,
    // Callback when user click on fab button to create new thread
    openNewThreadDialog: PropTypes.func,
    windowSize: PropTypes.string,
  };

  static defaultProps = {
    categories: [],
    threads: []
  };
  
  constructor(props, context) {
    super(props);
    this.state = {
      // Define if there's more threads to render
      hasMore: true,
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
  }

  componentWillReceiveProps(nextProps) {
    // Evaluate if there is search result. Else clear search query
    if (nextProps.searchError) {
      Meteor.setTimeout(() => {nextProps.resetSearch.bind(null)()}, 1000);
    }

    // Hack to enable scroll after initial render of 'All'
    // Meteor returns data many times after subscription
    if (this.state.hasMore === false && this.state.categoryValue === 1 && nextProps.threads.length < 21) {
      this.setState({hasMore: true});
      return;
    }
    //Stop infinite scroll
    let sub = nextProps.threads.length - this.props.threads.length;
    if ( this.state.hasMore) {
      // Stop when initial  threads in category is less than limit
      if (nextProps.threads.length < 10) {
        this.setState({hasMore: false});
        return;
      }
      // When loading in the same category, stop if last query add less than 10 items
      if ( nextProps.threads[0].category === this.props.threads[0].category) {
        if (sub > 0 && sub < 10) {
          this.setState({hasMore: false});
        }
      //When change category, if initial load is less than previous category load. Stop.  
      } else {
        if (sub < 0) {
          this.setState({hasMore: false});
        }
      }
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
      loadMore: this.props.increaseBrowsingLimit,
      hasMore: this.state.hasMore,
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
            viewThread={this.props.viewThread.bind(null)}/>
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
        <IconButton style={AutoPrefix.all(ComponentStyle.newThreadButton)} onClick={this.props.openNewThreadDialog}>
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
      this.props.onSearch.bind(null, event.target.value)();
    }
  }

  handleSelectCategory(e, index, value) {
    this.setState({categoryValue: value, hasMore: true});
    this.props.onSelectCategory.bind(null, value)();
  }

};

