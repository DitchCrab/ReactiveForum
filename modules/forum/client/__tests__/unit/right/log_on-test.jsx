import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import LogOn from 'forum/client/right/log_on';
import SignIn from 'forum/client/widgets/sign_in';
import SignUp from 'forum/client/widgets/sign_up';

describe('LogOn form', () => {
  var component;
  beforeEach(() => {
    component = TestUtils.renderIntoDocument(
      <LogOn />
    );
  });

  it('has signin form as default', () => {
    let form = TestUtils.findRenderedComponentWithType(component, SignIn);
    expect(form).toBeDefined();
  });

  it('has signup form when switch to signup view', () => {
    let form = TestUtils.findRenderedComponentWithType(component, SignIn);
    form.props.switchTo.bind(null, 'signup')();
    let s_form = TestUtils.findRenderedComponentWithType(component, SignUp);
    expect(s_form).toBeDefined();
  })
})
  
