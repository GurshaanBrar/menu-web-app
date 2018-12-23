import React, { Component } from 'react';
import { Row, Col} from 'react-bootstrap';
import { inject, observer } from "mobx-react";
import SearchBar from '../../../../Components/SearchBar/SearchBar';
import ItemsPreview from '../../../../Components/ItemsPreview/ItemsPreview';
import ItemModal from '../../../../Components/ItemModal/ItemModal';
import "./Items.css"

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Items extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: "",
      displayItems: this.props.CreateTabStore.itemSubStore.items,
      show: false
    }
    
    this.store=this.props.CreateTabStore;
    this.globalStore=this.props.globalStore;
  }

  componentDidMount() {
    this.store.getItems(this.globalStore.placeId);  // Initial Data Fetch
  }

  // updates the items in display
  _handleSearch(query) {
    var list = this.store.itemSubStore.items;
    var tempArr = [];

    // checks if i.name includes the query
    for (let i of list) {
      if(i.name.toLowerCase().includes(query.trim().toLowerCase())) {
        tempArr.push(i);
      }
    }  

    this.setState({displayItems: tempArr})
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  newItemClickHandler = () => {
    this.store.setItemInView({
      name: "My New Item",
      uri: "https://livingstonbagel.com/wp-content/uploads/2016/11/food-placeholder.jpg",
      description: "% A good description sells your food! Explain your dish and sell it %",
      price: "% predicted item price range: $ 10 - $ 14 %",
    })

    this.handleShow() 
  }

  render() {
    return(
      <div style={{overflowY:'scroll', height:"100vh"}}>
        <Row className="show-grid">
          <Col xs={1} md={2}>
              {/* SPACING */}
          </Col>
          <Col xs={7} md={6} style={{marginTop: "2%"}}>
              <SearchBar placeholder="search for Items" onChange={(val) => this._handleSearch(val)} />
          </Col>
          <Col xs={1} md={2} style={{marginTop: "2%"}}>
            <div className="items-add-item" onClick={() => this.newItemClickHandler()}>
              <i style={{fontSize:30}} className="fas fa-plus-circle"></i>
            </div>
          </Col>
          <Col xs={1} md={2}>
              {/* SPACING */}
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <div style={{marginLeft:"5%", marginRight:"5%", marginBottom: "1%", marginTop: "1%"}}>
                <ItemsPreview listOfItems={this.state.displayItems} handleShow={this.handleShow.bind(this)} />           
            </div>
          </Col>
        </Row>

        {/* modal is available to all components in container */}
        <ItemModal
          itemInView={this.store.itemSubStore.itemInView}
          handleClose={this.handleClose.bind(this)}
          show={this.state.show}
        />
      </div>
    )
  }    
}


export default Items;
