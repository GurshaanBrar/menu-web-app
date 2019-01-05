import React, { Component } from "react";
import MenuBoard from "../../../../Components/MenuBoard/MenuBoard";
import { inject, observer } from "mobx-react";
import { Row, Col } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import ItemModal from "../../../../Components/ItemModal/ItemModal";

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Menus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: "",
            show: false //hides and shows modal for items
        };

        this.store = this.props.CreateTabStore;
        this.globalStore = this.props.globalStore;
    }

    componentDidMount() {
        this.store.sortItems();
    }

    _handleSearch(val) {
        this.setState({ searchQuery: val });
    }

    handleClose() {
        this.store.sortItems();
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {
        return (
            <div>
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
                    <Col xs={12} md={12}>
                        <div style={{ margin: "2%" }}>
                            <MenuBoard
                                handleShow={this.handleShow.bind(this)}
                            />
                        </div>
                    </Col>
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
