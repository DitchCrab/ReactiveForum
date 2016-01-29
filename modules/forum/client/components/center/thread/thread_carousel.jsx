import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
// Components
import Swipeable from 'react-swipeable';
import { GridTile, IconButton, GridList, Styles } from 'material-ui';
import { ToggleStarBorder, HardwareKeyboardArrowLeft, HardwareKeyboardArrowRight } from 'material-ui/lib/svg-icons';
import OnClickOutside from 'react-onclickoutside';
import ComponentStyle from 'forum/client/styles/center/thread/thread_carousel';
const { Colors, AutoPrefix } = Styles;
// Helpers
import { toolbarWidth, checkMobileDevice } from 'forum/client/helpers';

/**
* ThreadCarousel component
* Use to navigate to previous thread 
* Support swipe in mobile devices
*/
@ReactMixin.decorate(OnClickOutside)
export default class ThreadCarousel extends Component {

  static propTypes = {
    viewedThreads: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func,
    onClickOutside: PropTypes.func,
    windowSize: PropTypes.string
  };

  static defaultProps = {
    viewedThreads: []
  };

  constructor(props) {
    super(props);
    this.state={
      // Carousel helds max 3 threads
      // Use to view next or previous
      viewIndex: 0,
      threads: props.viewedThreads.slice(0, 3)
    };
    this.renderEachCarouselThread = this.renderEachCarouselThread.bind(this);
    this.renderLeftArrow = this.renderLeftArrow.bind(this);
    this.renderRightArrow = this.renderRightArrow.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleRightSwipe = this.handleRightSwipe.bind(this);
    this.handleLeftSwipe = this.handleLeftSwipe.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_list =this.props.viewedThreads.length !== nextProps.viewedThreads.length;
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

  /**
   * On swipe right view the next three threads in list
   */
  handleRightSwipe(e) {
    e.preventDefault();
    let index = 0;
    if (this.props.viewedThreads.length - this.state.viewIndex <= 3) { // Set index to 0 since last round viewed the last threads in list
       index = 0; 
    } else { // Increase index
       index = this.state.viewIndex + 3;
    }
    let threads = this.props.viewedThreads.slice(index, index + 3); // Get threads by index
    if (threads.length > 0) {
      this.setState({viewIndex: index, threads: threads});
    }
  }

  /**
   * On swipe left view previous three threads in list
   */
  handleLeftSwipe(e) {
    e.preventDefault();
    let index = 0;
    if (this.state.viewIndex == 0) { // Since previous round viewed index from 0 to 3, this round will view index from -3 to 0. Convert to integer using length
      index = Math.floor(this.props.viewedThreads.length / 3) * 3;
    } else { // Reduce index 
      index = this.state.viewIndex -3;
    }
    var threads = this.props.viewedThreads.slice(index, index + 3);
    if (threads.length > 0) {
      this.setState({viewIndex: index, threads: threads});        
    }
  }

  // Close carousel on click outside dom
  handleClickOutside(event) {
    event.preventDefault();
    this.props.onClickOutside.bind(null)();
  }

};
