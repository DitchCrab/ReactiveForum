import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import BottomToolbar from 'forum/client/thread/bottom_toolbar';
import { Toolbar, TextField, IconButton } from 'material-ui';
import { ActionDone, NavigationClose, ActionViewCarousel } from 'material-ui/lib/svg-icons';

describe('Bottom Toolbar', () => {
  var component;
  var foo = {
    toggle: () => { return 1},
  }
  const thread = {_id: 1};
  beforeEach(() => {
    jasmineReact.spyOnClass(BottomToolbar, 'typeComment');
    jasmineReact.spyOnClass(BottomToolbar, 'addCommentToThread');
    spyOn(foo, 'toggle');
    component = TestUtils.renderIntoDocument(
      <BottomToolbar toggleCarousel={foo.toggle} viewingCarousel={false} threadId={thread._id}/>
    );
  });

  it('render toolbar component', () => {
    const toolbar = TestUtils.findRenderedComponentWithType(component, Toolbar);
    expect(toolbar).toBeDefined();
  });

  it('type commend on change', () => {
    const textfield = TestUtils.findRenderedComponentWithType(component, TextField);
    expect(textfield.props.defaultValue).toEqual(null);
    TestUtils.Simulate.change(ReactDOM.findDOMNode(textfield).getElementsByTagName('textarea')[1], {target: {value: 'Haha'}});
    expect(jasmineReact.classPrototype(BottomToolbar).typeComment.calls.count()).toEqual(1);
  });

  it('trigger addCommendToPost when click on button', () => {
    const button = TestUtils.scryRenderedComponentsWithType(component, IconButton)[0];
    button.props.onClick();
    expect(jasmineReact.classPrototype(BottomToolbar).addCommentToThread.calls.count()).toEqual(1);
  });

  it('has ActionDone icon when commending', () => {
    component.setState({comment: 'hi'});
    const icon = TestUtils.findRenderedComponentWithType(component, ActionDone);
    expect(icon).toBeDefined;
  });

  it('has ActionViewCarousel if not viewing Carousel', () => {
    const icon = TestUtils.findRenderedComponentWithType(component, ActionViewCarousel);
    expect(icon).toBeDefined();
  });

  it('has NavigationClose if click on ActionViewCarousel button', () => {
    component = TestUtils.renderIntoDocument(
      <BottomToolbar toggleCarousel={foo.toggle} viewingCarousel={true} threadId={thread._id}/>
    );
    const icon = TestUtils.findRenderedComponentWithType(component, NavigationClose);
    expect(icon).toBeDefined();
  });

  it('trigger toggleCarousel function when button is clicked', () => {
    const button = TestUtils.scryRenderedComponentsWithType(component, IconButton)[1];
    button.props.onClick();
    expect(foo.toggle.calls.count()).toEqual(1);
  })
    
})
