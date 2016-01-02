// Mod from React InfiniteScroll to use in overflow DOM element
import { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export default class InfiniteScroll extends Component {

  static defaultProps = {
    pageStart: 0,
    hasMore: false,
    threshold: 800
  }

  static PropTypes = {
    pageStart: PropTypes.number,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    loader: PropTypes.node.isRequired,
    parentLarge: PropTypes.node
  }
  
  constructor(props) {
    super(props);
    this.scrollListener = this.scrollListener.bind(this);
    this.attachScrollListener = this.attachScrollListener.bind(this);
    this.detachScrollListener = this.detachScrollListener.bind(this);
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();      
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.children, nextProps.children);
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  render() {
    let props = this.props;
    return (
      <div>
        {this.props.children}
        {this.props.hasMore ? this.props.loader : null }
      </div>
    )
  }

  scrollListener() {
    let el = ReactDOM.findDOMNode(this);
    let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    let innerHeight = window.innerHeight;
    if (this.props.parentLarge) {
      let parent = this.props.parentLarge;
      scrollTop = parent.pageYOffset || parent.scrollTop;
      innerHeight = parent.offsetHeight;
    }
    if (topPosition(el) + el.offsetHeight - scrollTop - innerHeight < Number(this.props.threshold)) {
      this.detachScrollListener();
      // call loadMore after detachScrollListener to allow
      // for non-async loadMore functions
      this.props.loadMore(this.pageLoaded += 1);
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      return;
    }
    let target = this.props.parentLarge || window;
    target.addEventListener('scroll', this.scrollListener);
    target.addEventListener('resize', this.scrollListener);
    this.scrollListener();
  }

  detachScrollListener() {
    let target = this.props.parentLarge || window;    
    target.removeEventListener('scroll', this.scrollListener);
    target.removeEventListener('resize', this.scrollListener);
  }
}
