// External
import React, { Component } from 'react';
import { Grid, Row, Col} from 'react-bootstrap';
import "./ItemPreview.css";

class ItemPreview extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      return(
        <Row>
          <Col xs={4} md={3}>
            <div className="itemCol">
              one
            </div>
          </Col>
          <Col xs={4} md={3}>
            <div className="itemCol">
              two
            </div>
          </Col>
          <Col xs={4} md={3}>
            <div className="itemCol">
              three
            </div>
          </Col>
          <Col xs={4} md={3}>
            <div className="itemCol">
              four
            </div>
          </Col>
          <Col xs={4} md={3}>
            <div className="itemCol">
              four
            </div>
          </Col>
        </Row>
      )
    }

}

export default ItemPreview;
