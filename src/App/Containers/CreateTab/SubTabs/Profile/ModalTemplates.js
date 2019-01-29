import React, { Component } from "react";
import { FormControl, Image, Col, Row } from "react-bootstrap";

class CoverImageTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempUrl: this.props.cover_uri
    };
  }

  handleChange(e) {
    this.setState({ tempUrl: e.target.value });
    this.props.handleChange(e);
  }

  render() {
    return (
      <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
        <h4>Cover Photo</h4>
        <p>
          Put the url to your chosen cover photo in the box below. This will be
          shown on the app when a customer views your profile. Wider photos work
          better for this case.
        </p>
        <div>
          <FormControl
            type="text"
            placeholder="Enter URL here."
            onChange={e => this.handleChange(e)}
          />
        </div>
        <br />
        <Image
          style={{ width: "100%", objectFit: "cover" }}
          src={this.state.tempUrl}
        />
      </div>
    );
  }
}

class IconImageTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempUrl: this.props.icon_uri
    };
  }

  handleChange(e) {
    this.setState({ tempUrl: e.target.value });
    this.props.handleChange(e);
  }

  render() {
    return (
      <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
        <h4>Icon Photo</h4>
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Image
            style={{
              width: "50%",
              objectFit: "cover",
              alignSelf: "center",
              marginRight: "2%"
            }}
            src={this.state.tempUrl}
          />
          <div>
            <p>
              Put the url to your chosen icon photo below. This will be seen on
              the app when your place is nearby customers, or when it is
              suggested.
            </p>
            <div>
              <FormControl
                type="text"
                placeholder="Enter URL here."
                onChange={e => this.handleChange(e)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class DescriptionTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempValue: this.props.value
    };
  }

  handleChange(e) {
    this.setState({ tempValue: e.target.value });
    this.props.handleChange(e);
  }

  render() {
    return (
      <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
        <h4>Description</h4>
        <p>
          Enter a description of your place. This info will be shown up on the
          app when users search for your place. This is your chance to tell your
          customers all about your restaurant and what makes it special Keep
          this short and succinct, users are less likely to read it if its more
          than 5 sentences.
        </p>
        <br />
        <br />
        <FormControl
          componentClass="textarea"
          value={this.state.tempValue}
          placeholder="Enter Description"
          onChange={e => this.handleChange(e)}
          rows={10}
          style={{ maxWidth: "100%", minWidth: "100%" }}
        />
      </div>
    );
  }
}

class DataTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: this.props.value.address,
      phone: this.props.value.phone_number,
      website: this.props.value.website
    };
  }

  changeAddress(e) {
    this.setState({ address: e.target.value });
    this.props.handleChange(e, "address");
  }

  changePhone(e) {
    this.setState({ phone: e.target.value });
    this.props.handleChange(e, "phone_number");
  }

  changeWebsite(e) {
    this.setState({ website: e.target.value });
    this.props.handleChange(e, "website");
  }

  render() {
    return (
      <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
        <h4>Place Info</h4>
        <p>Enter the necessary info for your place.</p>
        <br />
        <br />
        <Row className="show-grid">
          <Col xs={3} md={3}>
            <p>Address: </p>
          </Col>
          <Col xs={9} md={9}>
            <FormControl
              type="text"
              value={this.state.address}
              placeholder="Enter address."
              onChange={e => this.changeAddress(e)}

            />
          </Col>
        </Row>
        <br />
        <Row className="show-grid">
          <Col xs={3} md={3}>
            <p>Phone: </p>
          </Col>
          <Col xs={9} md={9}>
            <FormControl
              type="text"
              value={this.state.phone}
              placeholder="Enter phone."
              onChange={e => this.changePhone(e)}
            />
          </Col>
        </Row>
        <br />
        <Row className="show-grid">
          <Col xs={3} md={3}>
            <p>Website: </p>
          </Col>
          <Col xs={9} md={9}>
            <FormControl
              type="text"
              value={this.state.website}
              placeholder="Enter website."
              onChange={e => this.changeWebsite(e)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export {
  CoverImageTemplate,
  DescriptionTemplate,
  IconImageTemplate,
  DataTemplate
};
