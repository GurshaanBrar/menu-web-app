import React from 'react';
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './ItemCard.css'
// import { isPlainObject } from 'mobx/lib/utils/utils';
import { inject, observer } from "mobx-react";

@inject("CreateTabStore")
@observer
class ItemCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      varClassName:"",
      blur: false,
      show: false
    }

    this.store = this.props.CreateTabStore;
  }

  _blurImage = () => {
    this.setState({varClassName: "item-card-image-blur", blur: true});
  }

  _unblurImage = () => {
    this.setState({varClassName: "", blur: false});
  }

  _clickHandler = () => {
    this.store.setItemInView(this.props.data)

    this.props.handleShow() 
  }

  render() {    
    return (
      <div className="item-card-cont" onClick={() => this._clickHandler()} onMouseEnter={() => this._blurImage()} onMouseLeave={() => this._unblurImage()}>
        <Image rounded className={`item-card-image ${this.state.varClassName}`}  src={this.props.data.uri} alt={this.props.data.name}/>
        {
          this.state.blur? //Show caption if mouse is over element
          (
            <div class="item-card-caption">
              {this.props.data.name}
            </div>
          ):
          (null)
        }
      </div>
    )
  }
}

ItemCard.propTypes = {
  itemName: PropTypes.string.isRequired,
  uri: PropTypes.string.isRequired
}

export default ItemCard;
