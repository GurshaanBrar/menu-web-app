import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import './CreateTab.css';
import Items from './SubTabs/Items/Items';
import Menus from './SubTabs/Menus/Menus';
import Profile from './SubTabs/Profile/Profile';

@inject('globalStore')
@inject('CreateTabStore')
@observer
class CreateTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loc: this.props.location.pathname.split("/").pop()
    }

    this.globalStore = this.props.globalStore;
    this.store = this.props.CreateTabStore;
  }

  componentDidMount() {
    console.log("listening");
    this.store.getItems(this.globalStore.placeId);  // Initial Data Fetch
    this.store.setListener(this.globalStore.placeId); // Setup listener on Menus doc
  }

  componentWillReceiveProps(newProps) {
    // update location state
    this.setState({loc: newProps.location.pathname.split("/").pop()});
  }

  render() {
    var tempOffset = 64;
    
    if (!this.globalStore.sideMenuVisible) {
      tempOffset = 0;
    }
    else if(this.globalStore.sideMenuOpen) {
      tempOffset = 240;
    }
    else {
      tempOffset = 64;
    }

    return(
      <div style={{marginLeft: tempOffset, height:"100%"}}>
      {
        this.store.loading?
        (<div>loading...</div>):
        (
          <div>
          {
            this.state.loc === 'profile'?
            (<Profile/>):
            this.state.loc === 'items'?
            (<Items/>):
            this.state.loc === 'menus'?
            (<Menus/>):
            (null)
          }
          </div>
        )
      }
      </div>
    )
  }    
}


export default CreateTab;
