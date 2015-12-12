import TestUtils from 'react-addons-test-utils';
import Landing from 'forum/client/landing';
import { RainsedButton } from 'material-ui';

describe('Landing Page', () => {
  const root = TestUtils.renderIntoDocument(
    <Landing />
  );
  
  it('should display the slogan', () => {
    const header = TestUtils.findRenderedDOMComponentWithTag(root, 'h1');
    expect(header.innerText).toContain('EXPAT HOME');
  });

  it('has discover button', () => {
    const button = TestUtils.scryRenderedComponentsWithType(root, RainsedButton);
    expect(button).toBeDefined();
  });
})
