import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import { NewThread } from 'forum/client/components/center/lists/new_thread';
import ThreadForm from 'forum/client/components/center/lists/thread_form';

describe('New thread', () => {
  var foo = {
    categories: [{}, {}],
    actions: {
      pushPath: () => {},
      createThread: () => {}
    }
  };
  var component;
  beforeEach(() => {
    component = TestUtils.renderIntoDocument(
      <NewThread {...foo} />
    )
  });

  it('rendered ThreadForm', () => {
    let form = TestUtils.findRenderedComponentWithType(component, ThreadForm);
    expect(form).toBeDefined();
  })
})
