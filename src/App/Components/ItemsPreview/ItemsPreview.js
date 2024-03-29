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
          this.props.listOfItems.map((d, count) => {
            return(
              <ItemCard isItem={this.props.isItem} key={d.uri+count} data={d} count={count} handleShow={this.props.handleShow}/>
            )
          })
        }
        </div>
      )
    }

}

export default ItemsPreview;
