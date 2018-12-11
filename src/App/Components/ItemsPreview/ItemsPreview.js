// External
import React, { Component } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import ItemModal from '../ItemModal/ItemModal';
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

  handleClose() {
    console.log('closing');
    
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
      return(
        <div className="item-preview-cont">
        {
          this.props.listOfItems.map(d => {
            return(
              <ItemCard key={d.uri} itemName={d.name} uri={d.uri} handleShow={this.handleShow.bind(this)}/>
            )
          })
        }
        <ItemModal
          itemInView={this.store.itemSubStore.itemInView}
          handleClose={this.handleClose.bind(this)}
          show={this.state.show}
        />
        </div>
      )
    }

}

export default ItemsPreview;
