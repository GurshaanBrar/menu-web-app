// External
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row } from "react-bootstrap";
import "./HandHoldingModal.css";

const mql = window.matchMedia(`(min-width: 1000px)`);

class HandHoldingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWide: mql.matches, // if screen is wide enough modal will have some padding
      pageInView: 0,
      pages: this.props.pages
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
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

  _goBack() {
    this.setState({
      pageInView: this.state.pageInView - 1
    });
  }

  _goForeword() {
    this.setState({
      pageInView: this.state.pageInView + 1
    });
  }

  handleSave() {
    this.setState({ pageInView: 0 });
    this.props.handleSave();
  }

  render() {
    // controls width of modal
    // if browser is wide then have padding on sides else have full width modal
    var tempClassName = "item-preview-modal-cont-full";

    if (this.state.isWide) {
      tempClassName = "items-preview-modal-cont";
    }

    return (
      <Modal
        dialogClassName={tempClassName}
        show={this.props.show}
        onHide={() => this.props.handleClose()}
        animation={false}
      >
        <Modal.Header
          closeButton
        >
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "55vh", backgroundColor: "#f8f8f8" }}>
          <Row>{this.state.pages[`${this.state.pageInView}`]}</Row>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f8f8f8" }}>
          {this.state.pages.length > 1 ? (
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "row"
              }}
            >
              {this.state.pageInView > 0 ? (
                <Button
                  onClick={() => this._goBack()}
                  style={{ marginRight: "2%" }}
                >
                  Back
                </Button>
              ) : (
                <Button disabled style={{ marginRight: "2%" }}>
                  Back
                </Button>
              )}
              {this.state.pages.map((obj, count) => {
                if (this.state.pageInView >= count) {
                  return <div key={count} className="circleBase filled" />;
                } else {
                  return <div key={count} className="circleBase" />;
                }
              })}
              {this.state.pageInView >= this.state.pages.length - 1 ? (
                <Button
                  onClick={() => this.handleSave()}
                  variant="primary"
                  style={{ marginLeft: "2%" }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  onClick={() => this._goForeword()}
                  variant="primary"
                  style={{ marginLeft: "2%" }}
                >
                  Next
                </Button>
              )}
            </div>
          ) : (
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex"
              }}
            >
              <Button
                onClick={() => this.handleSave()}
                variant="primary"
                style={{ marginLeft: "2%" }}
              >
                Save
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default HandHoldingModal;
