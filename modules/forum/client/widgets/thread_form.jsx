import { Component, PropTypes } from 'react';
import { MenuItem, SelectField, TextField, FlatButton } from 'material-ui';
import ComponentStyle from 'forum/client/styles/widgets/thread_form';
import Immutable from 'immutable';

export default class ThreadForm extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    threadParams: PropTypes.object,
    onEdit: PropTypes.func
  };

  static defaultProps = {
    categories: [],
    threadParams: {}
  }

  constructor(props, context) {
    super(props);
    this.state = {selectValue: null};
    this._editCategory = this._editCategory.bind(this);
    this._editTitle = this._editTitle.bind(this);
    this._editDescription = this._editDescription.bind(this);
    this._editImg = this._editImg.bind(this);
    this._renderImg = this._renderImg.bind(this);
    this._editTags = this._editTags.bind(this);
  }

  render() {
    return (
      <div className="modal-form">
        <SelectField hintText="Select category" value={this.props.threadParams.category} onChange={this._editCategory}>
          {this.props.categories.map((category) => {
            return (<MenuItem key={category._id} value={category._id} primaryText={category.name}/>)
           })}
        </SelectField>
        <TextField
            value={this.props.threadParams.title}
            floatingLabelText="Title"
            onChange={this._editTitle}/>

        <TextField
            value={this.props.threadParams.description}
            floatingLabelText="Description"
            multiLine={true}
            onChange={this._editDescription}/>
        <TextField
            value={this.props.threadParams.tags? this.props.threadParams.tags.join(", ") : null}
            hintText="Seperate by ','"
            floatingLabelText="Tag"
            onChange={this._editTags}/>
        <div className="image-select">
          <FlatButton primary={true} label="Choose an Image">
            <input type="file" id="imageButton" style={ComponentStyle.fileInput} onChange={this._editImg}/>
          </FlatButton>
        </div>
        <div>
          {this.props.threadParams.img ? <img src={this.props.threadParams.img} style={ComponentStyle.image} /> : null }
        </div>
      </div>
    )
  }

  _editCategory(event, selectedIndex, value) {
    this.props.onEdit.bind(null, 'category', value)();
  }

  _editTitle(event) {
    event.preventDefault();
    this.props.onEdit.bind(null, 'title', event.target.value)();
  }

  _editDescription(event) {
    event.preventDefault;
    this.props.onEdit.bind(null, 'description', event.target.value)();      
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
      this.props.onEdit.bind(null, 'img', new_img)();
    };
    image.src = src;
  }

  _editTags(event) {
    event.preventDefault();
    let tags = Immutable.List(event.target.value.split(',')).map(x => x.trim()).toArray();
    this.props.onEdit.bind(null, 'tags', tags)();
  }
};

