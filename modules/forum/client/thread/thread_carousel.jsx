import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { toolbarWidth, checkMobileDevice } from 'forum/client/helpers';
import { GridTile, IconButton, GridList, Styles } from 'material-ui';
import { ToggleStarBorder, HardwareKeyboardArrowLeft, HardwareKeyboardArrowRight } from 'material-ui/lib/svg-icons';
import Swipeable from 'react-swipeable';
import Immutable from 'immutable';
import OnClickOutside from 'react-onclickoutside';
import ComponentStyle from 'forum/client/styles/thread/thread_carousel';
const { Colors, AutoPrefix } = Styles;

@ReactMixin.decorate(OnClickOutside)
export default class ThreadCarousel extends Component {

  static propTypes = {
    // List of threads viewed
    threadList: PropTypes.arrayOf(PropTypes.object),
    // Callback on click
    viewThread: PropTypes.func,
    // Callback to close carousel
    onClickOutside: PropTypes.func,
    windowSize: PropTypes.string
  }

  static defaultProps = {
    threadList: []
  }

  constructor(props) {
    super(props);
    this.state={
      // Carousel helds max 3 threads
      // Use to view next or previous
      viewIndex: 0,
      threads: Immutable.fromJS(props.threadList).slice(0, 3).toJS()
    };
    // Decoupling from main render method
    this.renderEachCarouselThread = this.renderEachCarouselThread.bind(this);
    this.renderLeftArrow = this.renderLeftArrow.bind(this);
    this.renderRightArrow = this.renderRightArrow.bind(this);
    // Event handlers
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleRightSwipe = this.handleRightSwipe.bind(this);
    this.handleLeftSwipe = this.handleLeftSwipe.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_list =this.props.threadList.length !== nextProps.threadList.length;
    const same_index = this.state.index === nextState.index;
    if (same_list && same_index) {
      return false;
    } else {
      return true;
    }
  }
  
  render() {
    let threads = this.state.threads.map(thread => this.renderEachCarouselThread(thread));
    return (
      <Swipeable
          style={AutoPrefix.all(ComponentStyle.wrapper(this.props.windowSize))}
          onSwipedRight={this.handleRightSwipe}
          onSwipedLeft={this.handleLeftSwipe}>
        { checkMobileDevice() ? null : this.renderLeftArrow() }
        <GridList
            cols={3}
            cellHeight={150}
            style={ComponentStyle.gridList}
        >
          {threads}
        </GridList>
        { checkMobileDevice() ? null : this.renderRightArrow() }
      </Swipeable>
    )
  }

  // Only render on no touch devices
  renderLeftArrow() {
    return (
      <IconButton onClick={this.handleLeftSwipe} style={ComponentStyle.leftArrow}>
        <HardwareKeyboardArrowLeft  color={Colors.white}/>
      </IconButton>
    )    
  }

  renderRightArrow() {
    return (
      <IconButton onClick={this.handleRightSwipe} style={ComponentStyle.rightArrow}>
        <HardwareKeyboardArrowRight color={Colors.white} />
      </IconButton>
    )    
  }

  handleRightSwipe(e) {
    e.preventDefault();
    if (this.props.threadList.length - this.state.viewIndex <= 3) {
      var index = 0;
    } else {
      var index = this.state.viewIndex + 3;
    }
    let threads = Immutable.fromJS(this.props.threadList).slice(index, index + 3).toJS();
    if (threads.length > 0) {
      this.setState({viewIndex: index, threads: threads});
    }
  }

  handleLeftSwipe(e) {
    e.preventDefault();
    if (this.state.viewIndex == 0) {
      var index = Math.floor(this.props.threadList.length / 3) * 3;
    } else {
      var index = this.state.viewIndex -3;
    }
    var threads = Immutable.fromJS(this.props.threadList).slice(index, index + 3).toJS();
    if (threads.length > 0) {
      this.setState({viewIndex: index, threads: threads});        
    }
  }

  renderEachCarouselThread(thread) {
    return (
      <GridTile key={thread._id}
                title={thread.title}
                subtitle={<span>by <b>{thread.user.username}</b></span>}
                actionIcon={<IconButton><ToggleStarBorder color={Colors.white}/></IconButton>}
                onClick={this.props.viewThread.bind(null, thread._id)} >
        <img src={thread.imgUrl} />
      </GridTile>
    )
  }

  handleClickOutside(event) {
    event.preventDefault();
    this.props.onClickOutside.bind(null)();
  }

};
