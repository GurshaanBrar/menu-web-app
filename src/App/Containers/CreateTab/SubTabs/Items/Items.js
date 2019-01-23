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
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: "",
            displayItems: this.props.CreateTabStore.items,
            show: false,
            newShow: false
        };

        this.store = this.props.CreateTabStore;
        this.globalStore = this.props.globalStore;

        // sets the menu categories... useful in items modal when selecting new categories
        this.store.setMenuCategories();
    }

    // updates the items in display
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

    handleClose() {
        this.setState({ show: false, newShow: false });
    }

    handleShow() {
        // set show to true to show modal
        // set new show false to ensure newItem modal doesn't appear
        this.setState({ show: true, newShow: false });
    }

    newItemClickHandler = () => {
        // set newShow to true to show modal
        // set new show false to ensure item modal doesn't appear
        this.setState({ show: false, newShow: true });
    };

    render() {
        return (
            <div style={{ overflowY: "scroll", height: "100vh" }}>
                <Row className="show-grid">
                    <Col xs={1} md={2}>
                        {/* SPACING */}
                    </Col>
                    <Col xs={7} md={6} style={{ marginTop: "2%" }}>
                        <SearchBar
                            placeholder="search for Items"
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
                                isItem = {true}
                                listOfItems={this.state.displayItems}
                                handleShow={this.handleShow.bind(this)}
                            />
                        </div>
                    </Col>
                </Row>

                {/* modal is available to all components in container */}
                <ItemModal
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
        );
    }
}

export default Items;
