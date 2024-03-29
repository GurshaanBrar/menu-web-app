/*
 *  ItemModal.js
 *
 *  Description:
 *
 */
import React, { Component } from "react";
import { Modal, Image, FormControl, Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { inject, observer } from "mobx-react";

const mql = window.matchMedia(`(min-width: 1000px)`);

@inject("CreateTabStore")
@inject("globalStore")
@observer
class ItemModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWide: mql.matches, // if screen is wide enough modal will have some padding
      editArea: "",
      editAreaValue: ""
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.editIcon = "fas fa-cog";
    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged() {
    this.setState({ isWide: mql.matches });
  }

  // This tracks which editor was clicked and assigns default edit area value
  _handleClick(e, val) {
    this.setState({
      editArea: e.target.innerHTML.toLowerCase(),
      editAreaValue: val
    });
  }

  // Triggered when editor value changes
  handleChange(e) {
    this.setState({ editAreaValue: e.target.value });
  }

  // triggered when save button is pressed
  _handleSubmit() {
    this.store.writeItems(
      this.globalStore.placeId,
      `${this.props.itemInView.id}.${this.state.editArea}`,
      this.state.editAreaValue
    );

    this.store.setItems(
      `${this.props.itemInView.id}.${this.state.editArea}`,
      this.state.editAreaValue
    );

    // Update both the formated catagories (the lanes, as well as the item in view)
    // nessisarry so that each instance of item in view  ill have real time updates
    var tempItemInView = { ...this.props.itemInView };
    tempItemInView[`${this.state.editArea}`] = this.state.editAreaValue;

    // update the correct item in view for the certain subtab
    this.store.setItemInView(tempItemInView, this.props.tab);
    this.setState({ editArea: "", editAreaValue: "" });
  }

  // Triggered when cancel button is pressed
  _handleCancel() {
    this.setState({ editArea: "", editAreaValue: "" });
  }

  render() {
    // controls width of modal
    // if browser is wide then have padding on sides else have full width modal
    var tempClassName = "item-preview-modal-cont-full";

    if (this.state.isWide) {
      tempClassName = "items-preview-modal-cont";
    }

    // Editor Form Controls
    const editor_text = (
      <div>
        <FormControl
          type="text"
          value={this.state.editAreaValue}
          placeholder="Enter text"
          onChange={this.handleChange.bind(this)}
        />
        <Button onClick={this._handleSubmit.bind(this)}>Save</Button>
        <Button onClick={this._handleCancel.bind(this)}>Cancel</Button>
      </div>
    );

    const editor_textarea = (
      <div>
        <FormControl
          componentClass="textarea"
          value={this.state.editAreaValue}
          placeholder="Enter text"
          onChange={this.handleChange.bind(this)}
          rows={5}
          style={{ maxWidth: "100%", minWidth: "100%" }}
        />
        <Button onClick={this._handleSubmit.bind(this)}>Save</Button>
        <Button onClick={this._handleCancel.bind(this)}>Cancel</Button>
      </div>
    );

    const editor_number = (
      <div>
        <FormControl
          type="text"
          value={this.state.editAreaValue}
          placeholder="Enter number"
          onChange={this.handleChange.bind(this)}
        />
        <Button onClick={this._handleSubmit.bind(this)}>Save</Button>
        <Button onClick={this._handleCancel.bind(this)}>Cancel</Button>
      </div>
    );

    return (
      <Modal
        dialogClassName={tempClassName}
        show={this.props.show}
        onHide={() => this.props.handleClose()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.itemInView.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f8f8" }}>
          <Row>
            <Col xs={9} md={9}>
              <Image
                style={{ width: "100%", objectFit: "cover" }}
                src={this.props.itemInView.uri}
              />
            </Col>
            <Col xs={3} md={3} style={{ color: "#5A626B" }}>
              <a
                onClick={e => this._handleClick(e, this.props.itemInView.name)}
                className="items-preview-custom-atag"
              >
                <Row>
                  <Col xs={9} md={10}>
                    Name
                  </Col>
                  <Col xs={3} md={2}>
                    <i className={this.editIcon} />
                  </Col>
                </Row>
              </a>
              <div style={{ paddingTop: "4%" }}>
                <Row>
                  <Col md={12}>
                    {this.state.editArea === "name"
                      ? editor_text
                      : this.props.itemInView.name}
                  </Col>
                </Row>
              </div>
              <hr />

              <a
                onClick={e =>
                  this._handleClick(e, this.props.itemInView.description)
                }
                className="items-preview-custom-atag"
              >
                <Row>
                  <Col xs={9} md={10}>
                    Description
                  </Col>
                  <Col xs={3} md={2}>
                    <i className={this.editIcon} />
                  </Col>
                </Row>
              </a>
              <div style={{ paddingTop: "4%" }}>
                <Row>
                  <Col md={12}>
                    {this.state.editArea === "description"
                      ? editor_textarea
                      : this.props.itemInView.description}
                  </Col>
                </Row>
              </div>
              <hr />

              <a
                onClick={e => this._handleClick(e, this.props.itemInView.price)}
                className="items-preview-custom-atag"
              >
                <Row>
                  <Col xs={9} md={10}>
                    Price
                  </Col>
                  <Col xs={3} md={2}>
                    <i className={this.editIcon} />
                  </Col>
                </Row>
              </a>
              <div style={{ paddingTop: "4%" }}>
                <Row>
                  <Col md={12}>
                    {this.state.editArea === "price" ? (
                      editor_number
                    ) : (
                      <div>$ {this.props.itemInView.price}</div>
                    )}
                  </Col>
                </Row>
              </div>
              <hr />
              <Button
                onClick={() => this.props._handleDelete()}
                bsStyle="danger"
                style={{ marginLeft: "2%" }}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ItemModal;
