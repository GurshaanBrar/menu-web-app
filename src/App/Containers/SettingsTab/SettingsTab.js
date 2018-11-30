import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import SettingsTabStore from '../../Stores/SettingsTabStore'
// import './CreateTab.css';

@inject('globalStore')
@observer
class SettingsTab extends Component {
  constructor(props) {
    super(props);

    this.globalStore = this.props.globalStore;
    this.store = SettingsTabStore;
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
      <div style={{marginLeft: tempOffset}}>SettingsTab</div>
    )
  }    
}


export default SettingsTab;
