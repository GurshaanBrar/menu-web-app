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
import { Row, Col } from "react-bootstrap";
import ItemModal from "../../../../Components/ItemModal/ItemModal";
import ItemsPreview from "../../../../Components/ItemsPreview/ItemsPreview";
import FontAwesome from "react-fontawesome";

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
            show: false,         // hides and shows modal for items
            menuSelected: false, // Flag if menu has be chosen, if false show all menus
        };
    }

    // ========== FUNCTIONS ========== //

    // Des: Fetches items data
    // Post: item data is updated in store
    componentDidMount() {
        console.log("Menus.js did mount");
        this.store.readItems(this.globalStore.placeId);
    }

    // Des: closes the item modal
    // Post: show is set to false, modal is closed
    handleClose() {
        this.setState({ show: false });
    }

    // Des: opens the item modal
    // Post: show is set to true, modal is visible
    handleShow() {
        this.setState({ show: true });
    }

    // Des: Handler for menus clickable, shows the menu which was clicked.
    // Post: The items in will be sorted and menuSelected will be set to true,
    //       menus board will be visible
    handleMenuShow() {
        // sorts items based on menuInView
        this.store.setFormattedCatagories();
        this.setState({ menuSelected: true });
    }

    // Des: Goes back to view showing all menus
    // Post: menuSelected will be set to false, all menus will be visible
    _goback() {
        this.setState({ menuSelected: false });
    }

    // ========== RENDER ========== //

    render() {
        // if there is no menu selected (all menus are shown), map menus from store
        // and assign a random image to it.
        if (!this.state.menuSelected) {
            var tempMenus = [];
            let stockImages = [
                "https://www.stockvault.net/data/2010/11/24/116237/preview16.jpg",
                "https://www.stockvault.net/data/2012/07/27/133058/preview16.jpg"
            ];
            let count = 0;

            for (let m of this.store.menus) {
                tempMenus.push({ name: m, uri: stockImages[count] });
                count++;
            }
        }

        return (
            <div>
                <Row className="show-grid">
                    <Col xs={1} md={1}>
                        {/* SPACING */}
                    </Col>
                    <Col xs={1} md={2} style={{ marginTop: "2%" }}>
                        {this.state.menuSelected ? (
                            <div
                                className="items-add-back"
                                onClick={() => this._goback()}
                            >
                                <FontAwesome
                                    className="arrow-alt-left"
                                    name="arrow-left"
                                    size="2x"
                                    style={{
                                        textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)"
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="items-add">
                                <FontAwesome
                                    className="arrow-alt-left"
                                    name="arrow-alt-left"
                                    size="2x"
                                    color="white"
                                    style={{
                                        textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)"
                                    }}
                                />
                            </div>
                        )}
                    </Col>
                    <Col xs={7} md={6} style={{ textAlign: "center" }}>
                        {this.state.menuSelected ? (
                            <h2>{this.store.menuSubStore.menuInView}</h2>
                        ) : (
                            <h2>Your Menu's</h2>
                        )}
                    </Col>
                    <Col xs={1} md={2} style={{ marginTop: "2%" }}>
                        <div
                            className="items-add-item"
                            onClick={() => this.store.addCat()}
                        >
                            <i
                                style={{ fontSize: 30 }}
                                className="fas fa-plus-circle"
                            />
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
                                <MenuBoard
                                    handleShow={this.handleShow.bind(this)}
                                />
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
                                listOfItems={tempMenus}
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
