import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import { EditThread } from 'forum/client/components/center/lists/edit_thread';
import ThreadForm from 'forum/client/components/center/lists/thread_form';
import Threads from 'forum/collections/threads';

describe('Edit thread', () => {
  var foo = {
    categories: [{}, {}],
    params: {},
    actions: {
      pushPath: () => {},
      editThread: () => {}
    }
  };
  var component;
  beforeEach(() => {
    spyOn(Threads, 'findOne').and.returnValue({_id: 1});
    component = TestUtils.renderIntoDocument(
      <EditThread {...foo} />
    )
  });

  it('rendered ThreadForm', () => {
    let form = TestUtils.findRenderedComponentWithType(component, ThreadForm);
    expect(form).toBeDefined();
  })
})
