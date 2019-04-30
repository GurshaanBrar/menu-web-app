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
import NewItemModal from "../../../../Components/NewItemModal/NewItemModal";

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Items extends Component {
    // ========== CONSTRUCTOR ========== //

    constructor(props) {
        super(props);

        this.state = {
            displayItems: [],    // Map items from store so that they can be mutated (on search)
            show: false,         // Flag for old item modal
            newShow: false,      // Flag for new item modal
            hasLoaded: false
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

    // 
    updateDisplayItems() {
        this.setState({displayItems: this.store.items, hasLoaded: true})
    }

    // ========== RENDER ========== //

    render() {      
        // updates display items if it has not already loaded and if ready to load
        if(!this.state.hasLoaded && !this.store.itemSubStore.loading ) {
            this.updateDisplayItems()
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
                            show={this.state.show}
                        />

                        <NewItemModal
                            itemInView={this.store.itemSubStore.itemInView}
                            handleClose={this.handleClose.bind(this)}
                            show={this.state.newShow}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default Items;
