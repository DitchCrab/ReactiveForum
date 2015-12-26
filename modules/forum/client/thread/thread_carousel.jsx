import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { GridTile, IconButton, GridList, Styles } from 'material-ui';
import { ToggleStarBorder, HardwareKeyboardArrowLeft, HardwareKeyboardArrowRight } from 'material-ui/lib/svg-icons';
import Swipeable from 'react-swipeable';
import Immutable from 'immutable';
import OnClickOutside from 'react-onclickoutside';
import * as ClientHelpers from 'forum/client/helpers';
const { Colors } = Styles;

@ReactMixin.decorate(OnClickOutside)
export default class ThreadCarousel extends Component {

  static propTypes = {
    threadList: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func,
    onClickOutside: PropTypes.func
  }

  static defaultProps = {
    threadList: []
  }

  constructor(props) {
    super(props);
    this.state={viewIndex: 0, threads: Immutable.fromJS(props.threadList).slice(0, 3).toJS()};
    this.renderEachCarouselThread = this.renderEachCarouselThread.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleRightSwipe = this.handleRightSwipe.bind(this);
    this.handleLeftSwipe = this.handleLeftSwipe.bind(this);
    this.renderLeftArrow = this.renderLeftArrow.bind(this);
    this.renderRightArrow = this.renderRightArrow.bind(this);
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var width;
    if (w_w >= 1200) {
      width = w_w * 7 / 12 - 40
    } else if (w_w >= 640 && w_w < 1200) {
      width = w_w / 2 - 40
    } else {
      width = w_w - 20
    }
    let carousel_style = {
      position: 'fixed',
      bottom: '56',
      height: 150,
      width: width,
      background: 'rgba(0, 0, 0, 0.2)',
    };
    let threads = this.state.threads.map(thread => this.renderEachCarouselThread(thread));
    return (
      <Swipeable style={carousel_style} onSwipedRight={this.handleRightSwipe} onSwipedLeft={this.handleLeftSwipe}>
        { ClientHelpers.checkMobileDevice() ? null : this.renderLeftArrow() }
        <GridList
            cols={3}
            cellHeight={150}
            style={{maxHeight: "100%"}}
        >
          {threads}
        </GridList>
        { ClientHelpers.checkMobileDevice() ? null : this.renderRightArrow() }
      </Swipeable>
    )
  }

  renderLeftArrow() {
    return (
      <IconButton onClick={this.handleLeftSwipe} style={{position: 'absolute', left: -20, top: 50, zIndex: 9999}}>
        <HardwareKeyboardArrowLeft  color={Colors.white}/>
      </IconButton>
    )    
  }

  renderRightArrow() {
    return (
      <IconButton onClick={this.handleRightSwipe} style={{position: 'absolute', right: -20, top: 50, zIndex: 9999}}>
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
                                                            actionIcon={<IconButton><ToggleStarBorder color="white"/></IconButton>}
                  onClick={this.props.viewThread.bind(null, thread._id)} >
        <img src={thread.imgUrl} />
      </GridTile>
    )
  }

  handleClickOutside(event) {
    this.props.onClickOutside.bind(null)();
  }

};
