import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import Wrapper from 'forum/client/thread/wrapper';
import Featured from 'forum/client/thread/featured';
import Thread from 'forum/client/thread/thread';
import ThreadCarousel from 'forum/client/thread/thread_carousel';

describe('Thread wrapper', () => {
  var component;
  describe('with featured', () => {
    var foo = {
      viewThread: (id) => {
        return id;
      },
      updateThreadList: () => {},
      windowSize: 'large'
    };

    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <Wrapper {...foo}/>
      );
    });

    it('render wrapper', () => {
      const wrapper = TestUtils.findRenderedDOMComponentWithClass(component, 'thread-wrapper');
      expect(wrapper).toBeDefined();
      expect(wrapper.props.style.margin).toEqual(0);
    });

    it('has featured', () => {
      const featured = TestUtils.scryRenderedComponentsWithType(component, Featured);
      expect(featured.length).toEqual(1);
    });

    it('has no thread carousel if not open', () => {
      const carousel = TestUtils.scryRenderedComponentsWithType(component, ThreadCarousel);
      expect(carousel.length).toEqual(0);
    });

    it('has one thread carousel if open', () => {
      component.setState({viewingCarousel: true});
      const carousel = TestUtils.scryRenderedComponentsWithType(component, ThreadCarousel);
      expect(carousel.length).toEqual(1);
    });
  });

  describe('with thread', () => {
    beforeEach(() => {
      jasmineReact.spyOnClass(Wrapper, 'toggleCarousel');
      const wrapper_props = {
        updateThreadList: () => {},
        threadList: [],
        thread: {_id: 1, title: 'None', imgUrl: 'None', description: 'None', user: {_id: 1, username: 'Tom'}},
        userBlackList: [],
        viewThread: () => {},
        windowSize: 'large'        
      };
      component = TestUtils.renderIntoDocument(
        <Wrapper {...wrapper_props}/>
      );
    });
    
    it('has thread render if viewing thread', () => {
      const thread = TestUtils.scryRenderedComponentsWithType(component, Thread)[0];
      expect(thread).toBeDefined();
      expect(thread.props.currentUser).toBeUndefined();
      expect(thread.props.viewingCarousel).toBeFalsy();
    });

    it('toggle carousel on callback on thread', () => {
      const thread = TestUtils.scryRenderedComponentsWithType(component, Thread)[0];
      thread.props.toggleCarousel();
      expect(jasmineReact.classPrototype(Wrapper).toggleCarousel).toHaveBeenCalled();
    })
  })
  
})
