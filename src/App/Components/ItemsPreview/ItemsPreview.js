// External
import React, { Component } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import { Modal, Button, Image } from 'react-bootstrap';
import { Row, Col} from 'react-bootstrap';
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
          <Modal dialogClassName='items-preview-modal-cont' show={this.state.show} onHide={() => this.handleClose()}>
            <Modal.Header closeButton>
              <Modal.Title >
              {
                this.store.itemSubStore.itemInView.name
              }
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:'#f8f8f8'}}>
              <Row>
                <Col xs={12} md={9}>
                    <Image style={{width: '100%', objectFit: 'cover'}} src={this.store.itemSubStore.itemInView.uri}/>
                    <p>key0: value</p>
                    <p>key0: value</p>
                    <p>key0: value</p>
                    <p>key0: value</p>
                    <p>key0: value</p>
                </Col>
                <Col xs={0} md={3}>
                  side men
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </div>
      )
    }

}

export default ItemsPreview;
