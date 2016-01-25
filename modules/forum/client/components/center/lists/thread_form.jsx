import { Component, PropTypes } from 'react';
// Components
import { FlatButton, RaisedButton, MenuItem, SelectField, TextField } from 'material-ui';
import ComponentStyle from 'forum/client/styles/center/lists/thread_form';
// Colelctions
import ThreadImgs from 'forum/collections/thread_imgs';

/**
* ThreadForm component
* Handling user inputs for NewThread and EditThread
*/
export default class ThreadForm extends Component {
  static propTypes = {
    // Thread categories from db
    header: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
    submitThread: PropTypes.func,
    pushPath: PropTypes.func
  };

  static defaultProps = {
    categories: [],
    thread: {}
  };

  constructor(props, context) {
    super(props);
    this.state = {
      category: props.thread.category,
      title: props.thread.title,
      description: props.thread.description,
      tags: props.thread.tags
    };
    this._editCategory = this._editCategory.bind(this);
    this._editTitle = this._editTitle.bind(this);
    this._editDescription = this._editDescription.bind(this);
    this._editImg = this._editImg.bind(this);
    this._renderImg = this._renderImg.bind(this);
    this._editTags = this._editTags.bind(this);
    this._submit = this._submit.bind(this);
  }

  // Fetching the right infor when user edit different threads
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      this.setState({error: nextProps.error});
    }
    if (this.props.thread._id !== nextProps.thread._id) {
      this.setState({
        category: nextProps.thread.category,
        title: nextProps.thread.title,
        description: nextProps.thread.description,
        tags: nextProps.thread.tags
      })
    } 
  }

  render() {
    return (
      <div style={ComponentStyle.wrapper}>
        <h1 style={ComponentStyle.header}>{this.props.header}</h1>
        <p style={ComponentStyle.error}>{this.state.error}</p>
        <SelectField hintText="Select category" value={this.state.category} onChange={this._editCategory} style={ComponentStyle.div}>
          {this.props.categories.map((category) => {
            return (<MenuItem key={category._id} value={category._id} primaryText={category.name}/>)
           })}
        </SelectField>
        <TextField
            value={this.state.title}
            floatingLabelText="Title"
            onChange={this._editTitle}
            style={ComponentStyle.div}/>

        <TextField
            value={this.state.description}
            floatingLabelText="Description"
            multiLine={true}
            onChange={this._editDescription}
            style={ComponentStyle.div}/>
        <TextField
            value={this.state.tags? this.state.tags.join(", ") : null}
            hintText="Seperate by ','"
            floatingLabelText="Tag"
            onChange={this._editTags}
            style={ComponentStyle.div}/>
        <div style={ComponentStyle.imageDiv}>
          <FlatButton primary={true} label="Choose an Image">
            <input type="file" id="imageButton" style={ComponentStyle.fileInput} onChange={this._editImg}/>
          </FlatButton>
        </div>
        <div>
          {this.state.img ? <img src={this.state.img} style={ComponentStyle.image} /> : null }
        </div>
        <div style={ComponentStyle.buttonDiv}>
          <RaisedButton label="Submit" secondary={true} onTouchTap={this._submit}/>
          <br/><br/>
          <FlatButton label="Cancel" onTouchTap={() => this.props.pushPath('/forum')}/>
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

  /**
   * Read file using file reader
   * Only for modern browsers
   * Will need fallback to iframe 
   */
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

  /**
   * Use canvas to resize image
   * Reduce upload time for image
   */
  _renderImg(src) {
    var image = new Image();
    var canvas = document.createElement('canvas');
    image.onload = () => {
      var ctx = canvas.getContext("2d");
      canvas.width = 600;
      canvas.height = canvas.width * (image.height / image.width);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      let new_img = canvas.toDataURL("image/jpeg", 0.7);
      this.setState({img: new_img});
    };
    image.src = src;
  }

  // Convert tags from string to array
  _editTags(event) {
    event.preventDefault();
    let tags = _.map(event.target.value.split(','), (x) => {return x.trim()});
    this.setState({tags: tags});
  }

  // Submission depend on props passed by NewThread or EditThread
  _submit() {
    let params_check = ['category', 'title', 'description', 'tags'];
    let blank = _.reject(params_check, (key) => { return _.has(this.state, key); });
    if (blank.length > 0) {
      this.setState({error: `Please complete ${blank[0]} field`});
    } else {
      let params = _.pick(this.state, 'category', 'title', 'description', 'tags');
      if (_.has(this.state, 'img')) {
        ThreadImgs.insert(this.state.img, (err, imgObj) => {
          params['imgId'] = imgObj._id;
          this.props.submitThread(params);
        });
      } else {
        this.props.submitThread(params);
      }
    }
  }
};
