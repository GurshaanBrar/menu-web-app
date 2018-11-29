import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import ApiDataStore from '../../Stores/ApiDataStore'
import './CreateTab.css';

@inject('globalStore')
@observer
class CreateTab extends Component {
  constructor(props) {
    super(props);

    this.globalStore = this.props.globalStore;
    this.store = ApiDataStore;
  }

  render() {
    var tempOffset = 64;
    
    if (!this.globalStore.sideMenuVisible) {
      tempOffset = 0;
    }
    else if(this.globalStore.sideMenuOpen) {
      tempOffset = 241;
    }
    else {
      tempOffset = 64
    }

    return(
      <div style={{marginLeft: tempOffset}}>this is a hugge test!!!!!!!</div>
    )
  }    
}


export default CreateTab;
