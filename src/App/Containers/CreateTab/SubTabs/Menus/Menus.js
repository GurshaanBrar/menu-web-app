/*
 *  Menus.js
 *
 *  Description:
 *      This class renders the menu board for a places menus. A user first sees all their menus, if they click
 *      one they are taken to that menus board, which shows the child parent relationship between categories
 *      and items.
 *
 *  Sections:
 *      1. CONSTRUCTOR
 *      2. FUNCTIONS
 *      3. RENDER
 */

import React, { Component } from "react";
import MenuBoard from "../../../../Components/MenuBoard/MenuBoard";
import { inject, observer } from "mobx-react";
import { Row, Col, Button } from "react-bootstrap";
import ItemModal from "../../../../Components/ItemModal/ItemModal";
import ItemsPreview from "../../../../Components/ItemsPreview/ItemsPreview";
import FontAwesome from "react-fontawesome";
import MottoBox from "../../../../Components/MottoBox/MottoBox";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import HandHoldingModal from "../../../../Components/HandHoldingModal/HandHoldingModal";
import MenuPreview from "../../../../Components/MenuPreview/MenuPreview";
import { DataTemplate } from "./ModalTemplates";
import "./Menus.css";

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Menus extends Component {
  // ========== CONSTRUCTOR ========== //

  constructor(props) {
    super(props);

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;

    this.state = {
      show: false, // hides and shows modal for items
      settingsShow: false, // hides and shows modal for the menus settings
      menuSelected: false, // Flag if menu has be chosen, if false show all menus
      tempData: {} // Gets updates as user fills out HHM, when save this gets written to store
    };

    console.log(this.state);
  }

  // ========== FUNCTIONS ========== //

  // Des: Fetches items data, reads items before reading menus
  // Post: item data is updated in store
  componentDidMount() {
    console.log("Menus.js did mount");
    this.store
      .readItems(this.globalStore.placeId)
      .then(resp => {
        this.store.readMenus(this.globalStore.placeId);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Des: closes the item modal and settings modal
  // Post: show is set to false, modal is closed
  handleClose() {
    this.setState({ show: false, showSettings: false });
  }

  // Des: opens the item modal
  // Post: show is set to true, modal is visible, ensures settings modal is closed
  handleShow() {
    this.setState({ show: true, showSettings: false });
  }

  // Des: opens the settings modal
  // Post: showSettings is set to true, modal is visible, ensures item modal is closed
  handleShowSettings() {
    this.setState({ show: false, showSettings: true });
  }

  // Des: Handler for menus clickable, shows the menu which was clicked.
  // Post: The items in will be sorted and menuSelected will be set to true,
  //       menus board will be visible
  handleMenuShow(name) {
    console.log(name);

    // sorts items based on menuInView
    this.store.setMenuInView(name);
    this.store.setFormattedCategories();
    this.setState({ menuSelected: true });
  }

  // Des: Goes back to view showing all menus
  // Post: menuSelected will be set to false, all menus will be visible
  _goback() {
    this.setState({ menuSelected: false });
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

  handleSave() {
    // do some validation here!!!!!

    this.store.writeMenuSettings(
      this.globalStore.placeId,
      this.store.menuSubStore.menuInView,
      this.state.tempData
    );

    // close the modal
    this.handleClose();
  }

  // ========== RENDER ========== //

  render() {
    // if there is no menu selected (all menus are shown), map menus from store
    // and assign a random image to it.
    // if (!this.state.menuSelected) {
    //   var tempMenus = [];
    //   let catCount = 0;
    //   let count = 0;

    //   for (let m in this.store.menus) {
    //     for(let cat in this.store.menus[`${m}`]) {
    //       if(cat !== 'time_active') {
    //         this.store.menus
    //       }
    //     }
    //     console.log(Object.keys(this.store.menus[`${m}`]).length - 1);

    //     tempMenus.push({ name: m, uri: stockImages[count] });
    //     count++;
    //   }
    // }

    return (
      <div>
        <Row className="show-grid">
          <Col xs={6} md={6} style={{ marginTop: "1%", marginLeft: "3%" }}>
            {this.state.menuSelected ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <div onClick={() => this._goback()}>
                  <FontAwesome
                    className="arrow-alt-left"
                    name="arrow-left"
                    size="2x"
                    style={{
                      textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)"
                    }}
                  />
                </div>
                <h2 style={{ marginLeft: "3%", paddingBottom: "2%" }}>
                  {this.store.menuSubStore.menuInView}
                </h2>
                <div style={{ marginLeft: "2%" }}>
                  <BootstrapSwitchButton
                    checked={true}
                    onlabel="Enabled"
                    onstyle="success"
                    offlabel="Disabled"
                    offstyle="danger"
                    onChange={checked => {}}
                  />
                </div>
              </div>
            ) : (
              <MottoBox
                motto="Your Menus"
                description="Click on an existing menu to start editing, or create a new menu. Watch our video tutorials here"
              />
            )}
          </Col>
          <Col
            xs="auto"
            md="auto"
            style={{ marginTop: "1%", marginLeft: "3%" }}
          >
            {this.state.menuSelected ? (
              <div
                className="items-add-item"
                onClick={() => {
                  this.handleShowSettings();
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  width: "5%",
                  marginTop: 20
                }}
              >
                <i
                  style={{ fontSize: 30, padding: "10%" }}
                  className="fas fa-cog"
                />
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                {/* <img
                  src="https://www.freeiconspng.com/uploads/svg-png-ai-csh-ico-icns-svg-base64-png-base64-21.png"
                  alt="food"
                  width="200"
                  height="200"
                /> */}
              </div>
            )}
          </Col>
        </Row>
        <Row className="show-grid">
          {this.state.menuSelected ? (
            <Col xs={12} md={12}>
              <div
                style={{
                  marginLeft: "2%",
                  marginRight: "2%",
                  flexDirection: "row",
                  display: "flex"
                }}
              >
                <MenuBoard handleShow={this.handleShow.bind(this)} />
                <div
                  onClick={() => {}}
                  className="menus-add-category-button"
                  style={{ height: 50 }}
                >
                  <i style={{ fontSize: 14 }} className="fas fa-plus" /> Add
                  Category
                </div>
              </div>
            </Col>
          ) : (
            <div className="menus-menu-previews">
              {this.store.menusStats.map(el => {
                return (
                  <div
                    onClick={() => this.handleMenuShow(el.name)}
                    key={`${el.name}`}
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                      cursor: "pointer"
                    }}
                  >
                    <MenuPreview
                      menuTitle={`${el.name}`}
                      numItems={`${el.numItems} items`}
                      numCats={`${el.numCategories} categories`}
                      isActive={el.isActive}
                      timeActive={`${el.timeActive.start}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Row>

        {/* modal is available to all components in container */}
        <ItemModal
          tab="menu"
          itemInView={this.store.menuSubStore.itemInView}
          handleClose={this.handleClose.bind(this)}
          show={this.state.show}
        />

        {this.state.menuSelected ? (
          <HandHoldingModal
            handleClose={this.handleClose.bind(this)}
            show={this.state.showSettings}
            title={"Menu Settings"}
            handleSave={() => this.handleSave()}
            pages={[
              <DataTemplate
                menuData={this.store.menusStats.filter(men => {
                  if (men.name === this.store.menuSubStore.menuInView) {
                    console.log(men)
                    return men;
                  }
                })}
                handleChange={(key, value) => this.setTempData(key, value)}
              />
            ]}
          />
        ) : null}
      </div>
    );
  }
}

export default Menus;
