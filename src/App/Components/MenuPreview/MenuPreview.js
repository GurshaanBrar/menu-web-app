/*
 * MenuPreview.js
 *
 * Des:
 *      This Component is a Menu Preview Card that displays
 *      relevent informatino for that menu, such as:
 *      number of items, muber of categories, if the menu is active or not and if
 *      so it will display the duration of time it is active,and finally the menu title.
 *
 */

import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./MenuPreview.css";

export default class MenuPreview extends React.Component {
  render() {
    return (
      //<CardColumns>

      <div>
        <Card border="dark" style={{ width: 296, height: 204 }}>
          {/* Card body, contains the title of the menu, and the information */}
          <Card.Body style={{ padding: 16 }}>
            <Card.Title>
              <div style={{ fontSize: 20 }}>
                {this.props.menuTitle} &emsp;
                {/* <img
                style={{ width: 35, height: 35 }}
                //className="foodIcon"
                src={require("../MenuPreview/burgerIcon.png")}
              /> */}
              </div>
            </Card.Title>

            {/* card text will display the relevant manu information */}
            <Card.Text style={{ fontSize: 14 }}>
              {this.props.numItems}
              <br />
              {this.props.numCats}
            </Card.Text>
          </Card.Body>

          {/* card footer will display the "isActive" and the "timeActive" information */}
          <Card.Footer
            style={{
              width: "100%",
              textAlign: "center",
              bottom: 0,
              position: "absolute"
            }}
          >
            {this.props.isActive ? (
              <div>Active &emsp;&emsp;{this.props.timeActive} </div>
            ) : (
              "Disabled"
            )}
          </Card.Footer>
        </Card>
      </div>
      //<ListGroupItem></ListGroupItem>
      //</CardColumns>
    );
  }
}

//this defines the default values of all of the given props.
MenuPreview.defaultProps = {
  menuTitle: "Test Menu",
  numItems: "0 items",
  numCats: "0 categories",
  isActive: false,
  timeActive: ""
};

MenuPreview.propTypes = {
  menuTitle: PropTypes.string.isRequired,
  numItems: PropTypes.string.isRequired,
  numCats: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  timeActive: PropTypes.string.isRequired
};
