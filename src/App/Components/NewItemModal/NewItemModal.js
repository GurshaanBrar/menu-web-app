// External
import React, { Component } from "react";
import { Modal, Image, FormControl, Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

const mql = window.matchMedia(`(min-width: 1000px)`);

@inject("CreateTabStore")
@inject("globalStore")
@observer
class NewItemModal extends Component {
    constructor(props) {
        super(props);

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.editIcon = "fas fa-cog";
        this.store = this.props.CreateTabStore;
        this.globalStore = this.props.globalStore;

        let tempMenus = [];
        let tempCategories = [];

        for (let el in this.store.menusTree) {
            tempMenus.push(el);
        }

        for (let men of tempMenus) {
            for (let cat of this.store.menusTree[`${men}`]) {
                tempCategories.push(cat);
            }
        }

        this.state = {
            isWide: mql.matches, // if screen is wide enough modal will have some padding
            name: "",
            description: "",
            price: "",
            uri: "",
            menu: "",
            category: "",
            menusArr: tempMenus,
            categoriesArr: tempCategories
        };
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

    // Triggered when editor value changes
    handleChange(e) {
        // this is the id to the rendered subsection which we want to change
        // used for locating correct target
        let tar = e.target.parentElement.parentElement.id;
        let retObj = {};        
        
        retObj[`${tar}`] = e.target.value;
        this.setState(retObj);
    }

    // triggered when save button is pressed
    _handleSubmit() {
        console.log(this.state);
        
        let submitObj = {
            name: this.state.name ,
            uri: this.state.uri ,
            description: this.state.description ,
            price: this.state.price ,
            menu: this.state.menu ,
            category: this.state.category
        }
        
        console.log(submitObj);
        // write obj to database
    }

    // Triggered when cancel button is pressed
    _handleCancel() {
        this.setState({ editArea: "", editAreaValue: "" });
    }

    render() {
        // controls width of modal
        // if browser is wide then have padding on sides else have full width modal
        var tempClassName = "item-preview-modal-cont-full";

        if (this.state.isWide) {
            tempClassName = "items-preview-modal-cont";
        }

        // Editor Form Controls
        const editor_text = editArea => (
            <div>
                <FormControl
                    type="text"
                    value={editArea}
                    placeholder="Enter text"
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );

        const editor_textarea = editArea => (
            <div>
                <FormControl
                    componentClass="textarea"
                    value={editArea}
                    placeholder="Enter text"
                    onChange={this.handleChange.bind(this)}
                    rows={5}
                    style={{ maxWidth: "100%", minWidth: "100%" }}
                />
            </div>
        );

        const editor_number = editArea => (
            <div>
                <FormControl
                    type="text"
                    value={editArea}
                    placeholder="Enter number"
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );

        const editor_dropdown = editArea => (
            <div>
                <FormControl
                    componentClass="select"
                    onChange={this.handleChange.bind(this)}
                >
                    <option>{""}</option>
                    {editArea.map(el => {
                        return (
                            <option value={el}>
                                {el}
                            </option>
                        );
                    })}
                </FormControl>
            </div>
        );

        return (
            <Modal
                dialogClassName={tempClassName}
                show={this.props.show}
                onHide={() => this.props.handleClose()}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#f8f8f8" }}>
                    <Row>
                        <Col xs={9} md={9}>
                            <Image
                                style={{ width: "100%", objectFit: "cover" }}
                                src={this.state.uri}
                            />
                        </Col>
                        <Col xs={3} md={3} style={{ color: "#5A626B" }}>
                            <a className="items-preview-custom-atag">
                                <Row>
                                    <Col xs={9} md={10}>
                                        Name
                                    </Col>
                                    <Col xs={3} md={2}>
                                        <i className={this.editIcon} />
                                    </Col>
                                </Row>
                            </a>
                            <div style={{ paddingTop: "4%" }}>
                                <Row>
                                    <Col md={12} id="name">
                                        {editor_text(this.state.name)}
                                    </Col>
                                </Row>
                            </div>
                            <hr />

                            <a className="items-preview-custom-atag">
                                <Row>
                                    <Col xs={9} md={10}>
                                        Description
                                    </Col>
                                    <Col xs={3} md={2}>
                                        <i className={this.editIcon} />
                                    </Col>
                                </Row>
                            </a>
                            <div style={{ paddingTop: "4%" }}>
                                <Row>
                                    <Col md={12} id="description">
                                        {editor_textarea(
                                            this.state.description
                                        )}
                                    </Col>
                                </Row>
                            </div>
                            <hr />

                            <a className="items-preview-custom-atag">
                                <Row>
                                    <Col xs={9} md={10}>
                                        Price
                                    </Col>
                                    <Col xs={3} md={2}>
                                        <i className={this.editIcon} />
                                    </Col>
                                </Row>
                            </a>
                            <div style={{ paddingTop: "4%" }}>
                                <Row>
                                    <Col md={12} id="price">
                                        {editor_number(this.state.price)}
                                    </Col>
                                </Row>
                            </div>
                            <hr />

                            <a className="items-preview-custom-atag">
                                <Row>
                                    <Col xs={9} md={10}>
                                        URI
                                    </Col>
                                    <Col xs={3} md={2}>
                                        <i className={this.editIcon} />
                                    </Col>
                                </Row>
                            </a>
                            <div style={{ paddingTop: "4%" }}>
                                <Row>
                                    <Col md={12} id="uri">
                                        {editor_textarea(this.state.uri)}
                                    </Col>
                                </Row>
                            </div>
                            <hr />

                            <a className="items-preview-custom-atag">
                                <Row>
                                    <Col xs={9} md={10}>
                                        Menus
                                    </Col>
                                    <Col xs={3} md={2}>
                                        <i className={this.editIcon} />
                                    </Col>
                                </Row>
                            </a>
                            <div style={{ paddingTop: "4%" }}>
                                <Row>
                                    <Col md={12} id="menu">
                                        {editor_dropdown(this.state.menusArr)}
                                    </Col>
                                </Row>
                            </div>
                            <hr />

                            <a className="items-preview-custom-atag">
                                <Row>
                                    <Col xs={9} md={10}>
                                        Categories
                                    </Col>
                                    <Col xs={3} md={2}>
                                        <i className={this.editIcon} />
                                    </Col>
                                </Row>
                            </a>
                            <div style={{ paddingTop: "4%" }}>
                                <Row>
                                    <Col md={12} id="category">
                                        {editor_dropdown(this.state.categoriesArr)}
                                    </Col>
                                </Row>
                            </div>
                            <hr />

                            <div>
                                <Button onClick={this._handleSubmit.bind(this)}>
                                    Save
                                </Button>
                                <Button>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

export default NewItemModal;
