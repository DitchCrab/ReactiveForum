import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import Login from 'forum/client/right/login';
import { TextField, RaisedButton, FlatButton } from 'material-ui';

describe('Login form', () => {
  var component;
  beforeEach(() => {
    jasmineReact.spyOnClass(Login, 'getLoginInfo');
    jasmineReact.spyOnClass(Login, 'userLogin');
    jasmineReact.spyOnClass(Login, 'userSignup');
    component = TestUtils.renderIntoDocument(
      <Login />
    );
  });

  it('has two text fields', () => {
    const fields = TestUtils.scryRenderedComponentsWithType(component, TextField);
    expect(fields.length).toEqual(2);
  });

  it('has two  buttons', () => {
    const rainsed_button = TestUtils.scryRenderedComponentsWithType(component, RaisedButton);
    const flat_button = TestUtils.scryRenderedComponentsWithType(component, FlatButton);
    expect(rainsed_button.length).toEqual(1);
    expect(flat_button.length).toEqual(1);    
  });

  it('trigger getLoginInfo function on change username field', () => {
    const fields = TestUtils.scryRenderedComponentsWithType(component,TextField);
    TestUtils.Simulate.change(ReactDOM.findDOMNode(fields[0]).getElementsByTagName('input')[0], {target: {value: 'Tom'}});
    expect(jasmineReact.classPrototype(Login).getLoginInfo.calls.argsFor(0)[0]).toEqual('username');
    expect(jasmineReact.classPrototype(Login).getLoginInfo.calls.argsFor(0)[1].target.value).toEqual('Tom');    
  });

  it('trigger getLoginInfo function on change password field', () => {
    const fields = TestUtils.scryRenderedComponentsWithType(component,TextField);
    TestUtils.Simulate.change(ReactDOM.findDOMNode(fields[1]).getElementsByTagName('input')[0], {target: {value: '123'}});
    expect(jasmineReact.classPrototype(Login).getLoginInfo.calls.argsFor(0)[0]).toEqual('password');
    expect(jasmineReact.classPrototype(Login).getLoginInfo.calls.argsFor(0)[1].target.value).toEqual('123');    
  });

  it('trigger signup function on click flat button', () => {
    const button = TestUtils.findRenderedComponentWithType(component, FlatButton);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
    expect(button.props.label).toEqual('Sign up');
    expect(jasmineReact.classPrototype(Login).userSignup.calls.count()).toEqual(1);
  });

  it('trigger login function on click rainsed button', () => {
    const button = TestUtils.findRenderedComponentWithType(component, RaisedButton);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(button).getElementsByTagName('button')[0]);
    expect(button.props.label).toEqual('Sign In');
    expect(jasmineReact.classPrototype(Login).userLogin.calls.count()).toEqual(1);
  });
})
