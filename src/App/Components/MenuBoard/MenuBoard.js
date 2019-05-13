/*
 *  MenuBoard.js
 *
 *  Description:
 *      This File renders the kaban board for each menu.
 *
 *  Sections:
 *      1) CustomLaneHeader
 *      2)
 */

import React, { Component } from "react";
// import Board from "react-trello";
import { inject, observer } from "mobx-react";
import { Image, FormControl, Button } from "react-bootstrap";
import { toJS } from "mobx";
import { Board } from 'react-trello';

import './MenuBoard.css'

@inject("CreateTabStore")
@inject("globalStore")
@observer
class CustomLaneHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      dorpdown: false,
      titleCleanCopy: this.props.title,
      title: this.props.title
    };

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
  }

  handleDropdown() {
    // opens the dropdown for editing
    this.setState({dropdown: true})
  }

  handleDropdownOff() {
    if(this.state.dropdown) {
      this.setState({dropdown: false})
    }
  }

  clickHandler() {
    // set state only if it is not already being edited
    if (!this.state.editable) {
      this.setState({ editable: true });
    }
  }

  // Triggered when editor value changes
  handleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleCancel() {
    this.setState({ editable: false, title: this.props.title });
  }

  handleSubmit() {
    this.store.writeNewCategoryName(
      this.globalStore.placeId,
      this.store.menuSubStore.menuInView,
      this.state.titleCleanCopy,
      this.state.title
    );

    this.setState({ editable: false, titleCleanCopy: this.state.title });
  }

  render() {
    return (
      <div
        style={{
          // borderBottom: '2px solid #c5c5c5',
          paddingBottom: 6,
          marginBottom: 10,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: "bold", minWidth: '100%'}}>
          {this.state.editable ? (
            <div>
              <FormControl
                type="text"
                value={this.state.title}
                placeholder="Enter Title"
                onChange={this.handleChange.bind(this)}
              />
              <Button onClick={() => this.handleSubmit()}>Save</Button>
              <Button onClick={() => this.handleCancel()}>Cancel</Button>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <div
                onClick={() => this.clickHandler()}
                style={{ cursor: "pointer"}}
              >
                <header>
                  {this.state.title} <i className="fas fa-cog" />
                </header>
              </div>
              <div 
                onClick={() => this.handleDropdown()}
                onMouseLeave={() => this.handleDropdownOff()}
                style={{padding: 2}} 
              >
                <i className="fas fa-ellipsis-h" />
                {this.state.dropdown? (
                  <div style={{backgroundColor: 'grey', position: 'absolute', minWidth: 150, zIndex: 3, borderRadius: 5}}>
                    <p className="option_first">hi im option 1</p>
                    <p className="option">hey im option 2</p>
                    <p className="option">uhh who am I?</p>
                    <p className="option">new fone hoo dis</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

@inject("CreateTabStore")
@inject("globalStore")
@observer
class CustomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHovering: false
    };

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
  }

  _handleClick() {
    var tempObj = {
      breadcrumb: this.props.breadcrumb,
      category: this.props.category,
      description: this.props.description,
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
      uri: this.props.uri,
      views: this.props.uri,
      index: this.props.index,
      menu: this.props.menu
    };

    this.store.setItemInView(tempObj, "menu");

    this.props.handleShow();
  }

  handleMouseHover(newState) {
    this.setState({ isHovering: newState });
  }

  handleDelete(e) {
    e.stopPropagation(); //stops parent onClick from also firing.
    //To remove a card
    eventBus.publish({
      type: "REMOVE_CARD",
      laneId: this.props.category,
      cardId: this.props.id
    });
    this.store.writeMenus(this.globalStore.placeId, this.props.menu, this.props.category, this.props.id);
  }

  render() {
    return (
      <div
        onClick={() => this._handleClick()}
        onMouseEnter={() => this.handleMouseHover(true)}
        onMouseLeave={() => this.handleMouseHover(false)}
        style={{ padding: "2%", display: "flex", flexDirection: "row" }}
      >
        <Image style={{ width: 100, height: 100 }} src={this.props.uri} />
        <div style={{ paddingLeft: "2%" }}>
          {this.state.isHovering ? (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ fontWeight: "bold" }}>{this.props.name}</div>
              <i onClick={this.handleDelete.bind(this)} class="material-icons">
                delete
              </i>
            </div>
          ) : (
            <div style={{ fontWeight: "bold" }}>{this.props.name}</div>
          )}
          <div>$ {this.props.price}</div>
        </div>
      </div>
    );
  }
}

//
let eventBus = undefined;

const setEventBus = handle => {
  eventBus = handle;
};
@inject("CreateTabStore")
@inject("globalStore")
@observer
export default class MenuBoard extends Component {
  constructor(props) {
    super(props);

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
  }

  render() {
    // This code must be in render to enable realtime updates to data
    var mapCats = this.props.CreateTabStore.menuSubStore.formattedCatagories;

    const data = {
      lanes: toJS(mapCats)
    };

    return (
      <Board
        data={data}
        customCardLayout
        draggable
        eventBusHandle={setEventBus}
        customLaneHeader={<CustomLaneHeader />}
        handleDragEnd={(
          cardId,
          sourceLaneId,
          targetLaneId,
          position,
          cardDetails
        ) => {
          this.store.writeItemCategory(
            this.globalStore.placeId,
            this.store.menuSubStore.menuInView,
            cardId,
            sourceLaneId,
            targetLaneId
          );
          console.log(cardDetails.breadcrumb + "category");
          this.store.setItems(
            `${cardDetails.breadcrumb}.category`,
            targetLaneId
          );
          this.store.setFormattedCategories();
        }}
        style={{ backgroundColor: "inherit" }}
      >
        <CustomCard handleShow={this.props.handleShow} />
      </Board>
    );
  }
}
