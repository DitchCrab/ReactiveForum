import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import SignIn from 'forum/client/widgets/sign_in';
import { TextField, RaisedButton, FlatButton } from 'material-ui';

describe('Sign In form', () => {
  var component;
  let foo = {
    switchTo: () => {}
  };
  beforeEach(() => {
    spyOn(foo, 'switchTo');
    jasmineReact.spyOnClass(SignIn, 'getSignInInfo');
    jasmineReact.spyOnClass(SignIn, 'userSignin');
    component = TestUtils.renderIntoDocument(
      <SignIn {...foo}/>
    );
  });

  it('has two text fields', () => {
    const fields = TestUtils.scryRenderedComponentsWithType(component, TextField);
    expect(fields.length).toEqual(2);
  });

  it('has two  buttons', () => {
    const rainsed_button = TestUtils.findRenderedComponentWithType(component, RaisedButton);
    const flat_button = TestUtils.findRenderedComponentWithType(component, FlatButton);
    expect(rainsed_button.props.label).toEqual('Sign In');
    expect(flat_button.props.label).toEqual('Sign Up');    
  });

  it('trigger getSigInInfo function on change username field', () => {
    const fields = TestUtils.scryRenderedComponentsWithType(component,TextField);
    TestUtils.Simulate.change(ReactDOM.findDOMNode(fields[0]).getElementsByTagName('input')[0], {target: {value: 'Tom'}});
    expect(jasmineReact.classPrototype(SignIn).getSignInInfo.calls.argsFor(0)[0]).toEqual('username');
    expect(jasmineReact.classPrototype(SignIn).getSignInInfo.calls.argsFor(0)[1].target.value).toEqual('Tom');    
  });

  it('trigger getSignInInfo function on change password field', () => {
    const fields = TestUtils.scryRenderedComponentsWithType(component,TextField);
    TestUtils.Simulate.change(ReactDOM.findDOMNode(fields[1]).getElementsByTagName('input')[0], {target: {value: '123'}});
    expect(jasmineReact.classPrototype(SignIn).getSignInInfo.calls.argsFor(0)[0]).toEqual('password');
    expect(jasmineReact.classPrototype(SignIn).getSignInInfo.calls.argsFor(0)[1].target.value).toEqual('123');    
  });

  it('trigger switchTo callback on click flat button', () => {
    const button = TestUtils.findRenderedComponentWithType(component, FlatButton);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
    expect(foo.switchTo.calls.count()).toEqual(1);
  });

  it('trigger login function on click rainsed button', () => {
    const button = TestUtils.findRenderedComponentWithType(component, RaisedButton);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(button).getElementsByTagName('button')[0]);
    expect(jasmineReact.classPrototype(SignIn).userSignin.calls.count()).toEqual(1);
  });
})
  
