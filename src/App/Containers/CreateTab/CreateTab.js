import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import './CreateTab.css';
import Photos from './SubTabs/Photos'
import Items from './SubTabs/Items/Items';
import Menus from './SubTabs/Menus/Menus';

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
      <div style={{marginLeft: tempOffset, height:"100%"}}>
      {
        this.state.loc === 'photos'?
        (<Photos store={this.store}/>):
        this.state.loc === 'items'?
        (<Items store={this.store}/>):
        this.state.loc === 'menus'?
        (<Menus store={this.store}/>):
        (null)
      }
      </div>
    )
  }    
}


export default CreateTab;
