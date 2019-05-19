import React, { Component } from "react";
import { FormControl, Image, Col, Row, Button } from "react-bootstrap";
var moment = require("moment");

class DataTemplate extends Component {
  constructor(props) {
    
    super(props);

    let oldMenuData = this.props.menuData[0];
    
    this.state = {
      name: oldMenuData.name,
      description: "",
      price: "",
      start_hour: oldMenuData.timeActive.start.split(':')[0],
      start_min:  oldMenuData.timeActive.start.split(':')[1], 
      duration_hour:  oldMenuData.timeActive.duration.split(':')[0],
      duration_min:  oldMenuData.timeActive.duration.split(':')[1]
    };

    this.hours = [];
    this.mins = [];

    // Add leading 0 when necessary
    for (let i = 0; i < 60; i++) {
      let stringHour = `${i}`;

      if (i < 10) {
        stringHour = `0${i}`;
      }

      if (i < 24) {
        this.hours.push(stringHour);
      }
      this.mins.push(stringHour);
    }
  }

  changeName(e) {
    this.setState({ name: e.target.value });
    this.props.handleChange("name", e.target.value);
  }

  handleTimeChange(e, type) {
    switch (type) {
      case 'start_hour':

        this.setState({star_hour: e.target.value});
        this.props.handleChange('start', `${e.target.value}:${this.state.start_min}`);
        break;

      case 'start_min':

        this.setState({start_min: e.target.value});
        this.props.handleChange('start', `${this.state.star_hour}:${e.target.value}`);
        break;

      case 'duration_hour':

        this.setState({duration_hour: e.target.value});
        this.props.handleChange('duration', `${e.target.value}:${this.state.duration_min}`);
        break;

      case 'duration_min':

        this.setState({duration_min: e.target.value});
        this.props.handleChange('duration', `${this.state.duration_hour}:${e.target.value}`);
        break;

    
      default:
        break;
    }
  }

  render() {
    return (
      <div style={{ marginLeft: "12%", marginRight: "12%", marginTop: "1%" }}>
        <p>
          To change this menus settings enter the new values into the fields
          below. To keep your changes click the save button at the bottom.
        </p>
        <br />
        <h5>Menu Name</h5>
        <Row className="show-grid">
          <Col xs={9} md={9}>
            <p>
              This is what your customers will see when looking at your place
              profile menus, ex breakfast
            </p>
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Enter name."
              onChange={e => this.changeName(e)}
            />
          </Col>
        </Row>

        <br />
        <h5>Time Active</h5>
        <Row className="show-grid">
          <Col
            xs={10}
            md={10}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <p style={{ marginRight: "1%", marginTop: "0.5%" }}>Start Time</p>
            <div style={{ marginRight: "1%" }}>
              <FormControl as="select" onChange={(e) => {this.handleTimeChange(e, 'start_hour')}}>
                <option>{this.state.start_hour}</option>
                {this.hours.map(hour => {
                  return (
                    <option key={`${0}/${hour}`} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </FormControl>
            </div>
            <p style={{ marginRight: "1%", marginTop: "0.5%" }}>
              <b>:</b>
            </p>
            <div style={{ marginRight: "1%" }}>
              <FormControl as="select" onChange={(e) => {this.handleTimeChange(e, 'start_min')}}>
                <option>{this.state.start_min}</option>
                {this.mins.map(hour => {
                  return (
                    <option key={`${1}/${hour}`} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </FormControl>
            </div>
            <p style={{ marginRight: "1%", marginTop: "0.5%" }}>, Duration</p>
            <div style={{ marginRight: "1%" }}>
              <FormControl as="select" onChange={(e) => {this.handleTimeChange(e, 'duration_hour')}}>
                <option>{this.state.duration_hour}</option>
                {this.hours.map(hour => {
                  return (
                    <option key={`${2}/${hour}`} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </FormControl>
            </div>
            <p style={{ marginRight: "1%", marginTop: "0.5%" }}>
              <b>:</b>
            </p>
            <div style={{ marginRight: "1%" }}>
              <FormControl as="select" onChange={(e) => {this.handleTimeChange(e, 'duration_min')}}>
                <option>{this.state.duration_min}</option>
                {this.mins.map(hour => {
                  return (
                    <option key={`${3}/${hour}`} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </FormControl>
            </div>
          </Col>
        </Row>
        <br />

        <Button onClick={() => this.props._handleDelete()} variant="danger">
          Delete
        </Button>
      </div>
    );
  }
}
export { DataTemplate };
