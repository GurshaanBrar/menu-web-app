import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import HomepageStore from '../../Stores/HomepageStore'
import './Homepage.css';

@inject('globalStore')
@inject('routing')
@observer
class Homepage extends Component {
  constructor(props) {
    super(props)
    this.globalStore = this.props.globalStore
    this.store = HomepageStore;
  }

  render() {
      return(
        <span>
          Home
        </span>
      )
  }
}

export default Homepage;
