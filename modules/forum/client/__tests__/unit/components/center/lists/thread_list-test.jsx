import TestUtils from 'react-addons-test-utils';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ReactDOM from 'react-dom';
import ThreadList from 'forum/client/components/center/lists/thread_list';
import { List } from 'material-ui';

describe('Featured', () => {
  var component;
  var foo = {
    threads: [
      {_id: 1, title: 'None', description: 'None', imgUrl: 'None', user: {username: 'Tom'}}
    ],
    viewThread: () => {}
  };
  
  beforeEach(() => {
    component = TestUtils.renderIntoDocument(
      <ThreadList {...foo}/>
    );
  });

  it('render List component', () => {
    const list = TestUtils.findRenderedComponentWithType(component, List);
    expect(list).toBeDefined();
  })
})
