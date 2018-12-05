// External
import React, { Component } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import "./ItemsPreview.css";

class ItemsPreview extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      return(
        <div className="item-preview-cont">
        {
          this.props.listOfItems.map(d => {
            return(
              <ItemCard key={d.uri} itemName={d.name} uri={d.uri}/>
            )
          })
        }
        </div>
      )
    }

}

export default ItemsPreview;
