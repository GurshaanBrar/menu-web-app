/*
 *  Item.js
 *
 *  Description:
 *      This class renders a places items from db and shows them in a pretty masonry view.
 *      Users can search and view items here, as well as create new items and edit old
 *      ones.
 *
 *  Sections:
 *      1. CONSTRUCTOR
 *      2. FUNCTIONS
 *      3. RENDER
 */

import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { inject, observer } from "mobx-react";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import ItemsPreview from "../../../../Components/ItemsPreview/ItemsPreview";
import ItemModal from "../../../../Components/ItemModal/ItemModal";
import "./Items.css";
import HandHoldingModal from "../../../../Components/HandHoldingModal/HandHoldingModal";
import {
  ItemImageTemplate,
  MenuCatTemplate,
  DataTemplate
} from "./ModalTemplates";

// for uuid generator
const uuidv1 = require("uuid/v1");

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Items extends Component {
  // ========== CONSTRUCTOR ========== //

  constructor(props) {
    super(props);

    this.state = {
      displayItems: [], // Map items from store so that they can be mutated (on search)
      show: false, // Flag for old item modal
      newShow: false, // Flag for new item modal
      hasLoaded: false,
      tempData: {}
    };

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
  }

  // ========== FUNCTIONS ========== //

  // Des: Fetches items data
  // Post: item data is updated in store
  componentDidMount() {
    console.log("Items.js did mount");
    this.store.readItems(this.globalStore.placeId);
  }

  // Des: Updates the items in display to items with a name matching the
  //      search query.
  // Pre: query should be a string
  // Post: local copy of items will be updated to match the query
  _handleSearch(query) {
    var list = this.store.items;
    var tempArr = [];

    // checks if i.name includes the query
    for (let i of list) {
      if (i.name.toLowerCase().includes(query.trim().toLowerCase())) {
        tempArr.push(i);
      }
    }

    this.setState({ displayItems: tempArr });
  }

  // Des: Closes both new and old item modals
  // Post: All modals closed
  handleClose() {
    this.setState({ show: false, newShow: false });
  }

  // Des: Shows old item modal, ensures new item modal is closed
  // Post show is set to true and newShow is set to false
  handleShow() {
    this.setState({ show: true, newShow: false });
  }

  // Des: Shows new item modal, ensures old item modal is closed
  // Post show is set to false and newShow is set to true
  newItemClickHandler = () => {
    this.setState({ show: false, newShow: true });
  };

  // Des: Updates the display items
  // Post: display items will be a mirror of the store items, hasLoaded set to true
  updateDisplayItems() {
    this.setState({ displayItems: this.store.items, hasLoaded: true });
  }

  // Des: Sets the key in tempData to the new value
  // Pre: key must be string, value should be correct type for key
  // Post: states tempData will be updated with new key/value
  setTempData(key, value) {
    let placeholder = this.state.tempData;

    placeholder[`${key}`] = value;

    this.setState({
      tempData: placeholder
    });
  }

  // Des: Triggered when modal reaches end and user clicks save
  //      writes to store and triggers write to db from store
  // Post: Store and firebase are updated with the new Key/Values
  handleSave() {
    let validInput = true; // maybe for some future form validation

    if (validInput) {
      let newItemId = uuidv1();
      let submitObj = {
        name: this.state.tempData.name,
        uri: this.state.tempData.uri,
        description: this.state.tempData.description,
        price: Number(this.state.tempData.price),
        views: 0
      };

      // write to database then update local display copy so we
      // dont need to refresh
      this.store.writeItems(
        this.globalStore.placeId,
        `${newItemId}`,
        submitObj
      );

      // local cache needs the id in the object so format it here.
      submitObj['id'] = newItemId;

      this.store.setItems(`${newItemId}`, submitObj, "add").then(res => {
        // update display items when store items are updated
        this.updateDisplayItems();
        this.setState({ newShow: false });
      });
    } else {
      console.log("err");
    }
  }

  // Des: Handles the deletion of items, triggered when user clicks delete button in item modal
  // Post: firebase and local cache are updated without the delete item (if successful), modal is closed
  //       and display items are updated
  _handleDelete() {
    this.store
      .deleteItem(
        this.globalStore.placeId,
        this.store.itemSubStore.itemInView.id
      )
      .then(resp => {
        this.updateDisplayItems();
        this.handleClose();
      });
  }

  // ========== RENDER ========== //

  render() {
    // updates display items if it has not already loaded and if ready to load
    if (!this.state.hasLoaded && !this.store.itemSubStore.loading) {
      this.updateDisplayItems();
    }

    return (
      <div style={{ overflowY: "scroll", height: "100vh" }}>
        {this.store.itemSubStore.loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Row className="show-grid">
              <Col xs={1} md={2}>
                {/* SPACING */}
              </Col>
              <Col xs={7} md={6} style={{ marginTop: "2%" }}>
                <SearchBar
                  placeholder="Search for items by name"
                  onChange={val => this._handleSearch(val)}
                />
              </Col>
              <Col xs={1} md={2} style={{ marginTop: "2%" }}>
                <div
                  className="items-add-item"
                  onClick={() => this.newItemClickHandler()}
                >
                  <i style={{ fontSize: 30 }} className="fas fa-plus-circle" />
                </div>
              </Col>
              <Col xs={1} md={2}>
                {/* SPACING */}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={12} md={12}>
                <div
                  style={{
                    marginLeft: "5%",
                    marginRight: "5%",
                    marginBottom: "1%",
                    marginTop: "1%"
                  }}
                >
                  <ItemsPreview
                    isItem={true}
                    listOfItems={this.state.displayItems}
                    handleShow={this.handleShow.bind(this)}
                  />
                </div>
              </Col>
            </Row>

            {/* modal is available to all components in container */}
            <ItemModal
              tab="item"
              itemInView={this.store.itemSubStore.itemInView}
              handleClose={this.handleClose.bind(this)}
              _handleDelete={() => this._handleDelete()}
              show={this.state.show}
            />

            {/* <NewItemModal
                            itemInView={this.store.itemSubStore.itemInView}
                            handleClose={this.handleClose.bind(this)}
                            show={this.state.newShow}
                        /> */}
            {/* modal is available to all components in container */}
            <HandHoldingModal
              handleClose={this.handleClose.bind(this)}
              show={this.state.newShow}
              title={"New Item"}
              handleSave={() => this.handleSave()}
              pages={[
                <ItemImageTemplate
                  handleChange={e => {
                    this.setTempData("uri", e.target.value);
                  }}
                />,
                <DataTemplate
                  handleChange={(e, key) =>
                    this.setTempData(key, e.target.value)
                  }
                />
              ]}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Items;
