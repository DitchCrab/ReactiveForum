import { Component, PropTypes } from 'react';
import { GridTile, IconButton, GridList } from 'material-ui';
import { ToggleStarBorder } from 'material-ui/lib/svg-icons';

export default class Featured extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let w_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var cell_height;
    if (w_w >= 640 && w_w < 1200) {
      cell_height = 250
    } else if (w_w >= 1200) {
      cell_height = 300
    }
    if (!this.props.threads) {
      return <div/>
    }
    let threads = this.props.threads.map((tile, index) => {
      return (
        <GridTile
            key={index}
            title={tile.title}
            subtitle={<span>{tile.description}</span>}                                                                                                            actionIcon={<IconButton><ToggleStarBorder color="white"/></IconButton>}
            actionPosition="left"
            titlePosition="bottom"
            cols={index === 0 ? 2 : 1}
            rows={index === 0 ? 2 : 1}
            onClick={this.props.viewThread.bind(null, tile._id)}>
          <img src={tile.imgUrl}/>
        </GridTile>
      )        
    });
    return (
      <GridList
          cols={2}
          cellHeight={cell_height}
          padding={1}
          style={{overflowY: 'auto'}}
      >
        {threads}
      </GridList>
    )
  }
}

Featured.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.object),
  viewThread: PropTypes.func
};

Featured.defaultProps = {
  threads: []
}
