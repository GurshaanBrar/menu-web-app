/*
 * MottoBox.js
 *
 * Des: Component to house a motto with a small description
 * Pre: component expects two props:
 *      - Motto (string)
 *      - Description (string)
 * Post: Motto is displayed in bold with description under it
 *
 * Invariant: - The motto is shown in bold and the description is
 *                shown below in a smaller font not bold
 *            - Motto and description are changeable (passed down by props)
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import "./MottoBox.css";

//using react
export default class MottoBox extends Component {
  render() {
    return (
      <div>
        <div style={styles.motto}>{this.props.motto}</div>
        <div style={styles.description}>{this.props.description}</div>
      </div>
    );
  }
}

//define styles for motto and description
const styles = {
  motto: {
    color: "black",
    margin: 10,
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 30
  },
  description: {
    color: "grey",
    margin: 10,
    fontFamily: "Arial",
    fontWheight: "300",
    fontSize: 20
  }
};

MottoBox.propTypes = {
    motto: PropTypes.string.isRequired,       // The motto which is bolded and a bigger text.
    description: PropTypes.string.isRequired  // Text below motto, smaller size not bolded.
};
