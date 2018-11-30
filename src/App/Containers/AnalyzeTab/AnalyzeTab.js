import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import AnalyzeTabStore from '../../Stores/AnalyzeTabStore'

@inject('globalStore')
@observer
class AnalyzeTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loc: this.props.location.pathname.split("/").pop()
    }
    
    // map stores to class
    this.globalStore = this.props.globalStore;
    this.store = AnalyzeTabStore;
  }

  componentWillReceiveProps(newProps) {
    // update location state
    this.setState({loc: newProps.location.pathname.split("/").pop()})
  }

  render() {
    // configure offset so cont goes beside sidemenu
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
      <div style={{marginLeft: tempOffset}}>Analyze tab {this.state.loc}</div>
    )
  }    
}


export default AnalyzeTab;
