import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { CircularProgress, ListItem, TextField, List, IconButton, Styles } from 'material-ui';
import { ContentAdd } from 'material-ui/lib/svg-icons';
import ThreadList from './thread_list';
import Immutable from 'immutable';
import InfiniteScroll from 'forum/client/widgets/infinite_scroll';
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
    increaseBrowsingLimit: PropTypes.func.isRequired
  }

  static defaultProps = {
    categories: [],
    threads: []
  }
  
  constructor(props, context) {
    super(props);
    this.state = {filterParams: {}, hasMore: true};
    this.renderEachCategory = this.renderEachCategory.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.searchThreadsByEnter = this.searchThreadsByEnter.bind(this);
    this.renderNewThread = this.renderNewThread.bind(this);
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
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w_w >= 640) {
      this.setState({parentLarge: ReactDOM.findDOMNode(this.refs.leftWrapper)});
    }
  }
  
  render() {
    let list = this.props.categories.map((category, index) => this.renderEachCategory(category, index));
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);    
    let w_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
    let wrapper_style= {};
    if (w_w >= 640) {
      wrapper_style = {
        height: `${w_h}px`,
        overflowY: "auto"
      };
    };
    var class_name;
    let search_style = {
      width: `${w_w - 20}px`
    };
    if (w_w >= 640) {
      class_name = "left-nav_fix";
      search_style.width = `${w_w/4 -5}px`
    }
    const infinite_props = {
      pageStart: 0,
      loadMore: this.props.increaseBrowsingLimit,
      hasMore: this.state.hasMore,
      loader: <div/>,
      parentLarge: this.state.parentLarge
    };
    return (
      <div>
        <div className={class_name} ref="leftWrapper" style={wrapper_style}>
          <InfiniteScroll {...infinite_props}>
            <TextField
                hintText="Search" style={search_style} onBlur={this.clearSearch} onKeyUp={this.searchThreadsByEnter} errorText={this.props.searchError}/>
            <div>
              <List>
                {list}
              </List>
            </div>
            <ThreadList currentUser={this.props.currentUser} threads={this.props.threads} viewThread={this.props.viewThread.bind(null)}/>
          </InfiniteScroll>
        </div>
        {this.props.currentUser ? this.renderNewThread() : null }
      </div>
    )
  }
  
  renderEachCategory(category, index) {
    let style = {};
    if (category._id === this.state.categorySelected) {
      style['color'] = 'red';
    }
    return (
      <ListItem key={index} style={style} primaryText={category.name} onClick={this.selectCategory.bind(null, category._id)}/>
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

