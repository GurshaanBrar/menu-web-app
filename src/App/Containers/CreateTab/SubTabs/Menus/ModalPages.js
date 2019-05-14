import React, { Component } from "react";
import { FormControl, Image, Col, Row, Form, Button, FormGroup, Dropdown } from "react-bootstrap";
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

import './Menu.css';

library.add(faFolderOpen)

class NameAndPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            tempUrl: null,
        }
    }

    handleChangeName(e) {
        this.setState({
            name: e.target.value
        })
        this.props.handleChangeName(e);
    }

    handleChangePhoto(e) {
        this.setState({
            tempUrl: e.target.value
        })
        this.props.handleChangePhoto(e);
    }

    render() {
        return(
            <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
                <h4>Menu Name</h4>
                <p>
                    
                </p>
                <div>
                    <FormControl
                        type="text"
                        placeholder="Enter URL here."
                        onChange={e => this.handleChangeName(e)}
                        value={this.state.name}
                    />
                </div>
                <br />
                <h4>Menu Photo</h4>
                <p>
                    Put the url to your chosen menu photo in the box below.
                </p>
                <div>
                    <FormControl
                        type="text"
                        placeholder="Enter URL here."
                        onChange={e => this.handleChangePhoto(e)}
                        value={this.state.tempUrl}
                    />
                </div>
                <br />
                <Image
                    style={{ width: "100%", objectFit: "cover" }}
                    src={this.state.tempUrl}
                />
            </div>  
        );
    }

}

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cat_name: this.props.category,
            items: [],
        }
    }

    _handleSearch = (e) => {
        if(e.target.value.length > 2) {
            console.log('yes');
        }
    }

    render() {
        return (
            <div className="cat-column">
                <div className="cat-col-header">
                    <h4 className="cat-col-title">{this.state.cat_name}</h4>
                    <FontAwesomeIcon icon="folder-open" className="cat-col-icon"/>
                </div>
                <div className="cat-col-content">
                    <form className="cat-col-form">
                        <input className="cat-col-input" type="text" placeholder="search for items" onChange={(e) => this._handleSearch(e)}/>
                    </form>
                </div>
                
                {/* <p>{this.state.cat_name}</p> */}
                {/* <li key={this.props.key}>{this.state.cat_name}</li>
                <span>&nbsp; &#10005;</span> */}
            </div>
        );
    }
}

class Categories extends Component {
    constructor(props) {
        super(props);
        this.categories = ['cat1', 'cat2'];
        if(this.props.categories) {
            this.state = {
                categories: this.props.categories,
            }
        }else {
            this.state = {
                categories: [],
            }
        }

    }

    handleChange(e) {
        e.preventDefault();
        // console.log(e.target.childNodes[0].childNodes[0].value);
        console.log(this.categories);
        this.props.handleChange(e.target.childNodes[0].childNodes[0].value);
        var temp = this.state.categories;
        temp.push(e.target.childNodes[0].childNodes[0].value);
        this.setState({
            categories: temp,

        })
    }

    render() {
        return (
            <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
                <h4>Categories</h4>
                <p>
                    Here add the food categories for your menu.
                    For example categories can be 
                    Appetizers, Burgers, Mains, Salads, etc.
                </p>
                <div>
                    <Form onSubmit={e => this.handleChange(e)} inline>
                        <FormGroup role="form">
                            <FormControl type="text" className="form-control"/>
                            <Button className="btn btn-primary btn-large centerButton" 
                            type="submit">Add</Button>
                        </FormGroup>
                    </Form>
                </div>
                <div className="cat-control">
                    {
                        this.state.categories.map(function(cat, i){
                            return (
                                <Item category={cat} key={i}/>
                                );
                        })
                    }
                </div>
            </div>

        )
    }

}

class ItemAdder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: this.props.categories.cats,
            dropdownOpen: false,
        }
        console.log(this.state.categories);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return(
            <div style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}>
                <h4>Categories</h4>
                <p>
                    Here add the food categories for your menu.
                    For example categories can be 
                    Appetizers, Burgers, Mains, Salads, etc.
                </p>
                <div>
                    <MDBDropdown>
                        <MDBDropdownToggle caret color="primary">
                            MDBDropdown
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic>
                            <MDBDropdownItem>Action</MDBDropdownItem>
                            <MDBDropdownItem>Another Action</MDBDropdownItem>
                            <MDBDropdownItem>Something else here</MDBDropdownItem>
                            <MDBDropdownItem divider />
                            <MDBDropdownItem>Separated link</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    {/* <Dropdown>
                        <Dropdown.Menu show>
                            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>

                            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                        </Dropdown.Menu>;
                    </Dropdown> */}
                    {/* <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                        Categories
                        </DropdownToggle>
                        <DropdownMenu id="dropdown-item-button" title="Dropdown button">
                            {
                                this.state.categories.map(function(item,i) {
                                    return <DropdownItem as="button">{item}</DropdownItem>
                                })
                            }
                        </DropdownMenu>
                    </Dropdown> */}
                </div>
            </div>
        );
    }
}

export {
    NameAndPhoto,
    Categories,
    ItemAdder
} 