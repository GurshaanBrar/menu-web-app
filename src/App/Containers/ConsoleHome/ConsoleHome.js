import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import ConsoleHomeStore from '../../Stores/ConsoleHomeStore'
// import './CreateTab.css';

@inject('globalStore')
@observer
class ConsoleHome extends Component {
  constructor(props) {
    super(props);

    this.globalStore = this.props.globalStore;
    this.store = ConsoleHomeStore;
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
      <div style={{marginLeft: tempOffset}}>ConsoleHome</div>
    )
  }    
}


export default ConsoleHome;
