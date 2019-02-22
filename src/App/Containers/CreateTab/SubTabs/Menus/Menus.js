import React, { Component } from "react";
import MenuBoard from "../../../../Components/MenuBoard/MenuBoard";
import { inject, observer } from "mobx-react";
import { Row, Col } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import ItemModal from "../../../../Components/ItemModal/ItemModal";
import ItemsPreview from "../../../../Components/ItemsPreview/ItemsPreview";
import FontAwesome from "react-fontawesome";

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Menus extends Component {
  constructor(props) {
    super(props);

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
      
    let tempMenus = []
    let stockImages = [
      "https://www.stockvault.net/data/2010/11/24/116237/preview16.jpg",
      "https://www.stockvault.net/data/2012/07/27/133058/preview16.jpg"
    ]
    let count = 0;

    for(let m of this.store.menus) {
      tempMenus.push({name: m, uri: stockImages[count]});
      count++;
    }

    this.state = {
      searchQuery: "",
      show: false, //hides and shows modal for items
      menuSelected: false,
      menus: tempMenus
    };

    // sets the menu categories... useful in items modal when selecting new categories
    this.store.setMenuCategories();
  }

  componentDidMount() {
    
  }

  _handleSearch(val) {
    this.setState({ searchQuery: val });
  }

  // closes the modal
  handleClose() {
    this.store.sortItems();
    this.setState({ show: false });
  }

  // opens the modal
  handleShow() {
    this.setState({ show: true });
  }

  // Shows the menu which was clicked
  handleMenuShow() {
    // sorts items based on menuInView
    this.store.sortItems();
    this.setState({ menuSelected: true });
  }

  // handles going back to choose different menus
  _goback() {
    this.setState({ menuSelected: false });
  }

  render() {
    
    return (
      <div>
        <Row className="show-grid">
          <Col xs={1} md={1}>
            {/* SPACING */}
          </Col>
          <Col xs={1} md={2} style={{ marginTop: "2%" }}>
            {this.state.menuSelected ? (
              <div className="items-add-back" onClick={() => this._goback()}>
                <FontAwesome
                  className="arrow-alt-left"
                  name="arrow-left"
                  size="2x"
                  style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                />
              </div>
            ) : (
              <div className="items-add">
                <FontAwesome
                  className="arrow-alt-left"
                  name="arrow-alt-left"
                  size="2x"
                  color="white"
                  style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                />
              </div>
            )}
          </Col>
          <Col xs={7} md={6} style={{ textAlign: "center" }}>
              {this.state.menuSelected ?
                (
                  <h2>{this.store.menuSubStore.menuInView}</h2>
                ):
                (<h2>Your Menu's</h2>)
              }
          </Col>
          <Col xs={1} md={2} style={{ marginTop: "2%" }}>
            <div className="items-add-item" onClick={() => this.store.addCat()}>
              <i style={{ fontSize: 30 }} className="fas fa-plus-circle" />
            </div>
          </Col>
          <Col xs={1} md={2}>
            {/* SPACING */}
          </Col>
        </Row>
        <Row className="show-grid">
          {this.state.menuSelected ? (
            <Col xs={12} md={12}>
              <div style={{ margin: "2%" }}>
                <MenuBoard handleShow={this.handleShow.bind(this)} />
              </div>
            </Col>
          ) : (
            <div
              style={{
                marginLeft: "5%",
                marginRight: "5%",
                marginBottom: "1%",
                marginTop: "1%",
                cursor: "pointer"
              }}
            >
              <ItemsPreview
                listOfItems={this.state.menus}
                handleShow={this.handleMenuShow.bind(this)}
                item={false}
              />
            </div>
          )}
        </Row>

        {/* modal is available to all components in container */}
        <ItemModal
          itemInView={this.store.menuSubStore.itemInView}
          handleClose={this.handleClose.bind(this)}
          show={this.state.show}
        />
      </div>
    );
  }
}

export default Menus;
