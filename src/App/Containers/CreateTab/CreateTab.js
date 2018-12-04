import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import ApiDataStore from '../../Stores/ApiDataStore'
import './CreateTab.css';
import Photos from './SubTabs/Photos'
import Items from './SubTabs/Items';
import Menus from './SubTabs/Menus';

@inject('globalStore')
@observer
class CreateTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loc: this.props.location.pathname.split("/").pop()
    }

    this.globalStore = this.props.globalStore;
    this.store = ApiDataStore;
  }

  componentWillReceiveProps(newProps) {
    // update location state
    this.setState({loc: newProps.location.pathname.split("/").pop()})
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
      <div style={{marginLeft: tempOffset}}>
      {
        this.state.loc === 'photos'?
        (<Photos/>):
        this.state.loc === 'items'?
        (<Items/>):
        this.state.loc === 'menus'?
        (<Menus/>):
        (null)
      }
      </div>
    )
  }    
}


export default CreateTab;
