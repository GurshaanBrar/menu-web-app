/*
 *  CreateTabStore.js
 *
 *  Description:
 *      This class manages routing when on the create tab (~/console/create/<subTab>).
 *      <subTab> can be one of the three values: items, profile, menus. Each render their
 *      subsequent component.
 *
 *  Sections:
 *      1. CONSTRUCTOR
 *      2. FUNCTIONS
 *      3. RENDER
 */

import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import "./CreateTab.css";
import Items from "./SubTabs/Items/Items";
import Menus from "./SubTabs/Menus/Menus";
import Profile from "./SubTabs/Profile/Profile";

@inject("globalStore")
@inject("CreateTabStore")
@observer
class CreateTab extends Component {
    // ========== CONSTRUCTOR ========== //

    constructor(props) {
        super(props);

        // grab the url of window
        this.state = {
            loc: this.props.location.pathname.split("/").pop()
        };

        this.globalStore = this.props.globalStore;
        this.store = this.props.CreateTabStore;
    }

    // ========== FUNCTIONS ========== //

    // Des: Runs when new props are passed down, in this case when sub location
    //      is changed, ie <subTab>
    // Post: location state variable will be updated with new subTab location,
    //       if it is a valid subTab then its component will be rendered below
    componentWillReceiveProps(newProps) {
        // update location state
        this.setState({ loc: newProps.location.pathname.split("/").pop() });
    }

    // ========== RENDER ========== //

    render() {
        var tempOffset = 64;

        if (!this.globalStore.sideMenuVisible) {
            tempOffset = 0;
        } else if (this.globalStore.sideMenuOpen) {
            tempOffset = 240;
        } else {
            tempOffset = 64;
        }

        return (
            <div style={{ marginLeft: tempOffset, height: "100%" }}>
                {this.state.loc === "profile" ? (
                    <Profile />
                ) : this.state.loc === "items" ? (
                    <Items />
                ) : this.state.loc === "menus" ? (
                    <Menus />
                ) : null}
            </div>
        );
    }
};

export default CreateTab;
