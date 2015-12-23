import { Component, PropTypes } from 'react';
import { GridTile, IconButton, GridList } from 'material-ui';
import { ToggleStarBorder } from 'material-ui/lib/svg-icons';
import Swipeable from 'react-swipeable';
import Immutable from 'immutable';
import listensToClickOutside from 'react-onclickoutside/decorator';

@listensToClickOutside
export default class ThreadCarousel extends Component {

  static propTypes = {
    threadList: PropTypes.arrayOf(PropTypes.object),
    viewThread: PropTypes.func
  }

  static defaultProps = {
    threadList: []
  }

  constructor(props) {
    super(props);
    this.state={viewIndex: 0, threads: Immutable.fromJS(props.threadList).slice(0, 3).toJS()};
    this.renderEachCarouselThread = this.renderEachCarouselThread.bind(this);
    this.handleRightSwipe = this.handleRightSwipe.bind(this);
    this.handleLeftSwipe = this.handleLeftSwipe.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
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
        <GridList
            cols={3}
            cellHeight={150}
            style={{maxHeight: "100%"}}
        >
          {threads}
        </GridList>
      </Swipeable>
    )
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

  handleClickOutside(event) {
    this.props.onClickOutside.bind(null)();
  }

};

