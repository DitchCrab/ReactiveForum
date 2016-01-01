import { Component, PropTypes } from 'react';
import { MenuItem, SelectField, TextField, FlatButton } from 'material-ui';
import ComponentStyle from 'forum/client/styles/widgets/thread_form';
import Immutable from 'immutable';
import ThreadImgs from 'forum/collections/thread_imgs';
import Threads from 'forum/collections/threads';

export default class ThreadForm extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    clearState: PropTypes.func,
    onCancel: PropTypes.bool,
    onSubmit: PropTypes.bool
  };

  static defaultProps = {
    categories: [],
  }

  constructor(props, context) {
    super(props);
    this.state = {};
    this._editCategory = this._editCategory.bind(this);
    this._editTitle = this._editTitle.bind(this);
    this._editDescription = this._editDescription.bind(this);
    this._editImg = this._editImg.bind(this);
    this._renderImg = this._renderImg.bind(this);
    this._editTags = this._editTags.bind(this);
    this._cancel = this._cancel.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.onCancel && !prevProps.onCancel) {
      this._cancel();
      return;
    }
    if (this.props.onSubmit && !prevProps.onSubmit) {
      this._submit();
      return
    }
  }

  render() {
    return (
      <div className="modal-form">
        <SelectField hintText="Select category" value={this.state.category} onChange={this._editCategory}>
          {this.props.categories.map((category) => {
            return (<MenuItem key={category._id} value={category._id} primaryText={category.name}/>)
           })}
        </SelectField>
        <TextField
            value={this.state.title}
            floatingLabelText="Title"
            onChange={this._editTitle}/>

        <TextField
            value={this.state.description}
            floatingLabelText="Description"
            multiLine={true}
            onChange={this._editDescription}/>
        <TextField
            value={this.state.tags? this.state.tags.join(", ") : null}
            hintText="Seperate by ','"
            floatingLabelText="Tag"
            onChange={this._editTags}/>
        <div className="image-select">
          <FlatButton primary={true} label="Choose an Image">
            <input type="file" id="imageButton" style={ComponentStyle.fileInput} onChange={this._editImg}/>
          </FlatButton>
        </div>
        <div>
          {this.state.img ? <img src={this.state.img} style={ComponentStyle.image} /> : null }
        </div>
      </div>
    )
  }

  _editCategory(event, selectedIndex, value) {
    this.setState({category: value});
  }

  _editTitle(event) {
    event.preventDefault();
    this.setState({title: event.target.value});
  }

  _editDescription(event) {
    event.preventDefault;
    this.setState({description: event.target.value});
  }

  _editImg(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    let imageType = /^image\//;
    if (!imageType.test(file.type)) {
      return;
    }
    reader.onload = (upload) => {
      let canvas_img = this._renderImg(upload.target.result);
    }
    reader.readAsDataURL(file);
  }

  _renderImg(src) {
    var image = new Image();
    var canvas = document.createElement('canvas');
    image.onload = () => {
      var ctx = canvas.getContext("2d");
      canvas.width = 600;
      canvas.height = canvas.width * (image.height / image.width);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      let new_img = canvas.toDataURL("image/jpeg", 0.8);
      this.setState({img: new_img});
    };
    image.src = src;
  }

  _editTags(event) {
    event.preventDefault();
    let tags = _.map(event.target.value.split(','), (x) => {return x.trim()});
    this.setState({tags: tags});
  }

  _cancel() {
    this.props.clearState();
  }

  _submit() {
    ThreadImgs.insert(this.state.img, (err, imgObj) => {
      let params = this.state;
      params['imgId'] = imgObj._id;
      Meteor.call('createThread', params, (err, res) => {
        this.setState({});
        this.props.clearState();
      })
    });
  }
};

