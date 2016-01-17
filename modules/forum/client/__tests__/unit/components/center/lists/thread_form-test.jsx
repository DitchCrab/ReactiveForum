import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import jasmineReact from 'jasmine-react-helpers-hotfix-0.14';
import ThreadForm from 'forum/client/components/center/lists/thread_form';
import { TextField, SelectField, FlatButton, MenuItem } from 'material-ui';

describe('Thread form widget', () => {
  var component;
  var foo = {
    categories: [
      { _id: 1, name: "General"},
      { _id: 2, name: "Hot"},
    ],
    submitThread: () => {},
  };
  beforeEach(() => {
    jasmineReact.spyOnClass(ThreadForm, '_editTitle');
    jasmineReact.spyOnClass(ThreadForm, '_editDescription');
    jasmineReact.spyOnClass(ThreadForm, '_editTags');
    jasmineReact.spyOnClass(ThreadForm, '_editImg');
    component = TestUtils.renderIntoDocument(
      <ThreadForm {...foo} />
    );
  });

  it('render a list of textfield', () => {
    const textfields = TestUtils.scryRenderedComponentsWithType(component, TextField);
    expect(textfields.length).toEqual(4);
  });

  it('render selectfield', () => {
    const selectfield = TestUtils.findRenderedComponentWithType(component, SelectField);
    expect(selectfield.props.children.length).toEqual(2);
  });

  it('change value of title field', () => {
    const title_text = TestUtils.scryRenderedComponentsWithType(component, TextField)[1];
    TestUtils.Simulate.change(ReactDOM.findDOMNode(title_text).getElementsByTagName('input')[0], {target: {value: 'Hil'}});
    expect(jasmineReact.classPrototype(ThreadForm)._editTitle.calls.count()).toEqual(1);
    expect(jasmineReact.classPrototype(ThreadForm)._editTitle.calls.argsFor(0)[0].target.value).toEqual('Hil');    
  });

  it('change value of description field', () => {
    const description_text = TestUtils.scryRenderedComponentsWithType(component, TextField)[2];
    TestUtils.Simulate.change(ReactDOM.findDOMNode(description_text).getElementsByTagName('textarea')[1], {target: {value: 'Hil'}});
    expect(jasmineReact.classPrototype(ThreadForm)._editDescription.calls.count()).toEqual(1);
    expect(jasmineReact.classPrototype(ThreadForm)._editDescription.calls.argsFor(0)[0].target.value).toEqual('Hil');   });
  
  it('change value of tags field', () => {
    const tags_text = TestUtils.scryRenderedComponentsWithType(component, TextField)[3];
    TestUtils.Simulate.change(ReactDOM.findDOMNode(tags_text).getElementsByTagName('input')[0], {target: {value: 'Hil'}});
    expect(jasmineReact.classPrototype(ThreadForm)._editTags.calls.count()).toEqual(1);
    expect(jasmineReact.classPrototype(ThreadForm)._editTags.calls.argsFor(0)[0].target.value).toEqual('Hil');
  });

  /* it('process image', () => {
     const file_input = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
     TestUtils.Simulate.change(ReactDOM.findDOMNode(file_input[2]), {target: {files: [{type: 'image/jped'}]}});
     expect(jasmineReact.classPrototype(ThreadForm)._editImg.calls.count()).toEqual(1);
     }); */
})
