import React, { Component } from "react";
import Board from "react-trello";
import { inject, observer } from "mobx-react";
import { Image, FormControl, Button } from "react-bootstrap";
import { toJS } from "mobx";

@inject("CreateTabStore")
@inject("globalStore")
@observer
class CustomLaneHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      titleCleanCopy: this.props.title,
      title: this.props.title
    };

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
  }

  clickHandler() {
    console.log(this.state.editable);

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
    this.store.changeCatName(
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
          justifyContent: "space-between"
        }}
      >
        <div style={{ fontSize: 14, fontWeight: "bold" }}>
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
            <div
              onClick={() => this.clickHandler()}
              style={{ cursor: "pointer" }}
            >
              <header>
                {this.state.title} <i className="fas fa-cog" />
              </header> 
            </div>
          )}
        </div>
      </div>
    );
  }
}

@inject("CreateTabStore")
@observer
class CustomCard extends Component {
  constructor(props) {
    super(props);

    this.store = this.props.CreateTabStore;
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

  render() {
    return (
      <div
        onClick={() => this._handleClick()}
        style={{ padding: "2%", display: "flex", flexDirection: "row" }}
      >
        <Image style={{ width: 100, height: 100 }} src={this.props.uri} />
        <div style={{ paddingLeft: "2%" }}>
          <div style={{ fontWeight: "bold" }}>{this.props.name}</div>
          <div>$ {this.props.price}</div>
        </div>
      </div>
    );
  }
}

@inject("CreateTabStore")
@observer
export default class MenuBoard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // This code must be in render to enable realtime updates to data
    var mapCats = this.props.CreateTabStore.menuSubStore.menuCats;

    const data = {
      lanes: toJS(mapCats)
    };

    return (
      <Board
        data={data}
        customCardLayout
        draggable
        customLaneHeader={<CustomLaneHeader />}
        handleDragEnd={(
          cardId,
          sourceLaneId,
          targetLaneId,
          position,
          cardDetails
        ) =>
          console.log(cardId, sourceLaneId, targetLaneId, position, cardDetails)
        }
        style={{ backgroundColor: "inherit" }}
      >
        <CustomCard handleShow={this.props.handleShow} />
      </Board>
    );
  }
}

// const data = {
//   lanes: [
//     {
//       id: '1',
//       title: 'Food Menu',
//       cards: [
//         {
//           id: '1',
//           name: "Chubby Chicken",
//           price: 22,
//           uri: "https://web.aw.ca/i/items/?i=teen-burger&d=teen-burger&cat=burgers&lang=teen-burger-en"
//         },
//         {
//           id: '2',
//           name: "Poutine",
//           price: 10,
//           uri: "https://www.seasonsandsuppers.ca/wp-content/uploads/2014/01/new-poutine-1-500x500.jpg"
//         }
//       ]
//     },
//     {
//       id: '2',
//       title: 'Drink Menu',
//       cards: [
//         {
//           id: '3',
//           name: "Coffee",
//           price: 5,
//           uri: "https://www.nespresso.com/ncp/res/uploads/recipes/1900px_Global_OL_ALL_Coffee%20Moment_Recipe_Latte%20Macchiato_2017_2019.jpg"
//         },
//         {
//           id: '4',
//           name: "Cosmo",
//           price: 22,
//           uri: "https://cdn.liquor.com/wp-content/uploads/2017/09/01105619/cosmopolitan-1200x628-social-Molly.jpg"
//         }
//       ]
//     },
//   ]
// }
