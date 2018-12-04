import React, { Component } from 'react';

import { Row, Col} from 'react-bootstrap';
import SearchBar from '../../../Components/SearchBar/SearchBar';

class Menus extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: ""
    }
  }

  _handleSearch(val) {
    this.setState({searchQuery:val})
  }

  render() {

    return(
      <div>
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
            <div style={{margin:"2%"}}>
            {this.state.searchQuery}
            {/* Add Photos display here */}
            </div>
          </Col>
        </Row>
      </div>
    )
  }    
}


export default Menus;
