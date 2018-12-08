import React, { Component } from 'react';
import { Row, Col} from 'react-bootstrap';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import ItemsPreview from '../../../Components/ItemsPreview/ItemsPreview';

class Items extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: "",
      displayItems: this.props.store.itemSubStore.items
    }
    this.store=this.props.store;
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

  render() {
    return(
      <div style={{overflowY:'scroll', height:"100vh"}}>
        <Row className="show-grid">
          <Col xs={1} md={2}>
              {/* SPACING */}
          </Col>
          <Col xs={10} md={8} style={{marginTop: "2%"}}>
              <SearchBar placeholder="search for Items" onChange={(val) => this._handleSearch(val)} />
          </Col>
          <Col xs={1} md={2}>
              {/* SPACING */}
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <div style={{marginLeft:"5%", marginRight:"5%", marginBottom: "1%", marginTop: "1%"}}>
                <ItemsPreview listOfItems={this.state.displayItems}/>           
            </div>
          </Col>
        </Row>
      </div>
    )
  }    
}


export default Items;
