// External
import React, { Component } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import "./ItemsPreview.css";
import { inject, observer } from "mobx-react";

@inject("CreateTabStore")
@observer
class ItemsPreview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show:false
    }

    this.store = this.props.CreateTabStore
  }



  render() {
      return(
        <div className="item-preview-cont">
        {
          this.props.listOfItems.map(d => {
            return(
              <ItemCard key={d.uri} data={d} handleShow={this.props.handleShow}/>
            )
          })
        }
        </div>
      )
    }

}

export default ItemsPreview;
