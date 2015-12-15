import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import ThreadCarousel from 'forum/client/thread/thread_carousel';
import Swipeable from 'react-swipeable';
import { GridTile } from 'material-ui';

describe('Thread Carousel', () => {
  var component;
  var foo = {
    view: (id) => { return id},
  }
  describe('with no thread', () => {
    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <ThreadCarousel viewThread={foo.view}/>
      );
    });

    it('render swipeable element', () => {
      const swipe = TestUtils.findRenderedComponentWithType(component, Swipeable);
      expect(swipe).toBeDefined();
    });

    it('has no thread', () => {
      const threads = TestUtils.scryRenderedComponentsWithType(component, GridTile);
      expect(threads.length).toEqual(0);
    })
  });

  describe('with threads', () => {
    beforeEach(() => {
      spyOn(foo, 'view');
      jasmineReact.spyOnClass(ThreadCarousel, 'handleRightSwipe');
      jasmineReact.spyOnClass(ThreadCarousel, 'handleLeftSwipe');      
      const threads = [
        {_id: 1, imgUrl: 'none', title: 'None', user: {username: 'Tom'}},
        {_id: 2, imgUrl: 'none', title: 'None1', user: {username: 'Tom1'}},        
      ];
      component = TestUtils.renderIntoDocument(
        <ThreadCarousel viewThread={foo.view} threadList={threads}/>
      );
    });

    it('has two threads', () => {
      const threads = TestUtils.scryRenderedComponentsWithType(component, GridTile);
      expect(threads.length).toEqual(2);
    });

    it('callback viewthread on click on tile', () => {
      const thread = TestUtils.scryRenderedComponentsWithType(component, GridTile)[0];
      thread.props.onClick();
      expect(foo.view.calls.argsFor(0)[0]).toEqual(1);
    });

    it('trigger swipe right', () => {
      const swipe = TestUtils.findRenderedComponentWithType(component, Swipeable);
      swipe.props.onSwipedRight();
      expect(jasmineReact.classPrototype(ThreadCarousel).handleRightSwipe).toHaveBeenCalled();
    });

    it('trigger swipe left', () => {
      const swipe = TestUtils.findRenderedComponentWithType(component, Swipeable);
      swipe.props.onSwipedLeft();
      expect(jasmineReact.classPrototype(ThreadCarousel).handleLeftSwipe).toHaveBeenCalled();
    })
    
  })
})
