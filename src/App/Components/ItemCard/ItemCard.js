import React from 'react';
import { Thumbnail } from 'react-bootstrap';
import PropTypes from 'prop-types';

class ItemCard extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Thumbnail onClick={() => alert(`you clicked ${this.props.itemName}`)} src={this.props.uri} alt={this.props.itemName} style={{padding:0, width: '30vh'}}>
        <h4 style={{textAlign: 'center'}}>{this.props.itemName}</h4>
      </Thumbnail>
    )
  }
}

ItemCard.propTypes = {
  itemName: PropTypes.string.isRequired,
  uri: PropTypes.string.isRequired
}

export default ItemCard;