/*
 *  Profile.js
 *
 *  Description:
 *      This class renders the places profile with its information in database. Here users can edit
 *      their places data such as name, description, address, phone, etc, by clicking the edit button
 *      which will pop up the HHM (Hand Holding Modal) to edit.
 *
 *  Sections:
 *      1. CONSTRUCTOR
 *      2. FUNCTIONS
 *      3. RENDER
 */

import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Row, Col, Image, Table, Button } from "react-bootstrap";
import HandHoldingModal from "../../../../Components/HandHoldingModal/HandHoldingModal";
import {
    CoverImageTemplate,
    DescriptionTemplate,
    IconImageTemplate,
    DataTemplate,
    HoursTemplate
} from "./ModalTemplates"; 

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Profile extends Component {
    // ========== CONSTRUCTOR ========== //

    constructor(props) {
        super(props);

        this.state = {
            show: false, // hides and shows modal for items
            tempData: {} // Gets updates as user fills out HHM, when save this gets written to store
        };

        // map store from props
        this.store = this.props.CreateTabStore;
        this.globalStore = this.props.globalStore;
    }

    // ========== FUNCTIONS ========== //

    // Des: Fetches place data
    // Post: place data is updated in store
    componentDidMount() {
        this.store.readPlaces(this.globalStore.placeId);
    }

    // Des: Closes HHM modal
    // Post: state.show is false, modal closed
    handleClose() {
        this.setState({ show: false });
    }

    // Des: Opens HHM modal
    // Post: state.show is true, modal opened
    handleShow() {
        this.setState({ show: true });
    }

    // Des: Triggered when modal reaches end and user clicks save
    //      writes to store and triggers write to db from store
    // Post: Store and firebase are updated with the new Key/Values
    handleSave() {
        // for all the keys updated set the store with those updates
        for (let key in this.state.tempData) {
            this.store.setProfileSubStore(key, this.state.tempData[`${key}`]);
        }

        // Update firebase
        this.store.writePlaces(this.globalStore.placeId);
        this.setState({ show: false });
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

    // ========== RENDER ========== //

    render() {
        var pData = this.store.profileSubStore.profileData;

        return (
            <div style={{ overflowY: "scroll", height: "100vh" }}>
                {this.store.profileSubStore.loading !== true ? (
                    <div>
                        <Row className="show-grid" style={{ margin: "2%" }}>
                            <Col xs={12} md={12}>
                                <div style={{ textAlign: "center" }}>
                                    <h1>{pData.name}</h1>
                                </div>
                            </Col>
                        </Row>
                        <Row className="show-grid" style={{ margin: "2%" }}>
                            <Col
                                xs={12}
                                md={6}
                                style={{ alignItems: "center" }}
                            >
                                <Image
                                    style={{ width: "100%" }}
                                    src={pData.cover_uri}
                                />
                                <div style={{ marginTop: "4%" }}>
                                    <h4 style={{ textAlign: "center" }}>
                                        <b>Description</b>
                                    </h4>
                                    <p
                                        style={{
                                            marginTop: "4%",
                                            marginRight: "2%",
                                            marginLeft: "2%"
                                        }}
                                    >
                                        {pData.description}
                                    </p>
                                </div>
                            </Col>
                            <Col xs={12} md={6} style={{ textAlign: "center" }}>
                                <div>
                                    <h4>
                                        <b>Address</b>
                                    </h4>
                                    <p>{pData.address}</p>
                                </div>
                                <div style={{ marginTop: "4%" }}>
                                    <h4>
                                        <b>Phone</b>
                                    </h4>
                                    <p>{pData.phone_number}</p>
                                </div>
                                <div style={{ marginTop: "4%" }}>
                                    <h4>
                                        <b>Website</b>
                                    </h4>
                                    <p>
                                        <a href={pData.website}>
                                            {pData.website}
                                        </a>
                                    </p>
                                </div>
                                <div style={{ marginTop: "4%" }}>
                                    <h4>
                                        <b>Tags</b>
                                    </h4>
                                    <p>todo</p>
                                </div>
                                <div
                                    style={{
                                        marginTop: "4%",
                                        width: "50%",
                                        marginLeft: "25%"
                                    }}
                                >
                                    <h4>
                                        <b>Hours</b>
                                    </h4>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <b>Sunday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[0]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[0]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Monday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[1]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[1]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Tuesday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[2]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[2]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Wednesday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[3]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[3]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Thursday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[4]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[4]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Friday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[5]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[5]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Saturday</b>
                                                </td>
                                                <td>
                                                    {
                                                        pData.formatted_hours[6]
                                                            .open
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pData.formatted_hours[6]
                                                            .close
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <Button
                                    onClick={() => this.handleShow()}
                                    style={{ marginTop: "4%" }}
                                >
                                    <i className="fas fa-edit" /> Edit
                                </Button>
                            </Col>
                        </Row>

                        {/* modal is available to all components in container */}
                        <HandHoldingModal
                            handleClose={this.handleClose.bind(this)}
                            show={this.state.show}
                            title={"Edit Profile"}
                            handleSave={() => this.handleSave()}
                            pages={[
                                <CoverImageTemplate
                                    cover_uri={pData.cover_uri}
                                    handleChange={e =>
                                        this.setTempData(
                                            "cover_uri",
                                            e.target.value
                                        )
                                    }
                                />,
                                <IconImageTemplate
                                    icon_uri={pData.icon_uri}
                                    handleChange={e =>
                                        this.setTempData(
                                            "icon_uri",
                                            e.target.value
                                        )
                                    }
                                />,
                                <DescriptionTemplate
                                    value={pData.description}
                                    handleChange={e =>
                                        this.setTempData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />,
                                <DataTemplate
                                    value={pData}
                                    handleChange={(e, key) =>
                                        this.setTempData(key, e.target.value)
                                    }
                                />,
                                <HoursTemplate
                                    times={pData.unformatted_hours}
                                    handleChange={(key, val) =>
                                        this.setTempData(key, val)
                                    }
                                />
                            ]}
                        />
                    </div>
                ) : (
                    <div>loading...</div>
                )}
            </div>
        );
    }
}

export default Profile;
