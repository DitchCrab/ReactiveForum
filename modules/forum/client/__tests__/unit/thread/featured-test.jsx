import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import Featured from 'forum/client/thread/featured';
import { GridList, GridTile, IconButton } from 'material-ui';

describe('Featured', () => {
  var component;
  var foo = {
    view: (id) => { return id;}
  };
  beforeEach(() => {
    const threads = [
      {_id: 1, title: 'None', description: 'None', imgUrl: 'None'}
    ];
    spyOn(foo, 'view');
    component = TestUtils.renderIntoDocument(
      <Featured threads={threads} viewThread={foo.view}/>
    );
  });

  it('render threads in grid list', () => {
    const grid = TestUtils.findRenderedComponentWithType(component, GridList);
    expect(grid).toBeDefined();
  });

  it('has one thread tile', () => {
    const threads = TestUtils.scryRenderedComponentsWithType(component, GridTile);
    expect(threads.length).toEqual(1);
    expect(threads[0].props.title).toEqual('None');
  });

  it('trigger callback when click on thread tile', () => {
    const thread = TestUtils.scryRenderedComponentsWithType(component, GridTile)[0];
    thread.props.onClick();
    expect(foo.view.calls.argsFor(0)[0]).toEqual(1);
  })
})
