// External
import React, { Component } from 'react';
import { Grid, Row, Col} from 'react-bootstrap';

class ApiActions extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      return(
        <div style={{"marginBottom": "5em"}}>
            <div className="componentHeader">ACTIONS</div>
            <Row style={{"marginTop":"5em"}}>
              {/* <Col xs={4} md={4}> */}
                {/* spacing */}
              {/* </Col> */}
              <Col xs={4} md={4}>
                <i style={{"marginLeft":"15%"}} class="material-icons">create_new_folder</i>
              </Col>
              {/* <Col xs={4} md={4}> */}
                {/* spacing */}
              {/* </Col> */}
            </Row>
            <Row style={{"marginTop":"1em"}}>
              {/* <Col xs={4} md={4}> */}
                {/* spacing */}
              {/* </Col> */}
              <Col xs={4} md={4}>
                <a onClick={() => {this.props.handleAction(3)}}>Write Technical Instructions</a>
              </Col>
              {/* <Col xs={4} md={4}> */}
                {/* spacing */}
              {/* </Col> */}
            </Row>
          </div>
      )
    }

}

export default ApiActions;
