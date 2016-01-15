import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import Featured from 'forum/client/components/center/lists/featured';
import { List, ListItem, IconButton } from 'material-ui';

describe('Featured', () => {
  var component;
  var foo = {
    view: (id) => { return id;}
  };
  beforeEach(() => {
    const threads = [
      {_id: 1, title: 'None', description: 'None', imgUrl: 'None', user: {username: 'Tom'}}
    ];
    spyOn(foo, 'view');
    component = TestUtils.renderIntoDocument(
      <Featured threads={threads} viewThread={foo.view}/>
    );
  });

  it('render threads in list', () => {
    const grid = TestUtils.findRenderedComponentWithType(component, List);
    expect(grid).toBeDefined();
  });

  it('has one thread tile', () => {
    const threads = TestUtils.scryRenderedComponentsWithType(component, ListItem);
    expect(threads.length).toEqual(1);
    expect(threads[0].props.primaryText).toEqual('None');
  });

  it('trigger callback when click on thread tile', () => {
    const thread = TestUtils.scryRenderedComponentsWithType(component, ListItem)[0];
    thread.props.onTouchTap();
    expect(foo.view.calls.argsFor(0)[0]).toEqual(1);
  })
})
