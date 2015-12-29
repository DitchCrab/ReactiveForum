import { Component, PropTypes } from 'react';
import { SelectField, TextField, FlatButton } from 'material-ui';
import Immutable from 'immutable';

export default class ThreadForm extends Component {
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
    let menuItems = Immutable.fromJS(this.props.categories).map(x => x.set('payload', x.get("_id")).set('text', x.get("name"))).toJS();
    const img_input_style = {
      cursor: "pointer",
      position: "absolute",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      width: "100%",
      opacity: "0"
    }
    return (
      <div className="modal-form">
        <SelectField
            value={this.props.threadParams.category}
            onChange={this._editCategory}
            hintText="Category"
            menuItems={menuItems} />

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
            <input type="file" id="imageButton" style={img_input_style} onChange={this._editImg}/>
          </FlatButton>
        </div>
        <div>
          {this.props.threadParams.img ? <img src={this.props.threadParams.img} style={{width: 100, height: 100}} /> : null }
        </div>
      </div>
    )
  }

  _editCategory(event, selectedIndex, menuItem) {
    this.setState({selectValue: menuItem.payload});
    this.props.onEdit.bind(null, 'category', menuItem.payload)();
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

ThreadForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  threadParams: PropTypes.object,
  onEdit: PropTypes.func
};

ThreadForm.defaultProps = {
  categories: [],
  threadParams: {}
}
