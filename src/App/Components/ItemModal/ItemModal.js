// External
import React, { Component } from 'react';
import { Modal, Image, FormControl, Button } from 'react-bootstrap';
import { Row, Col} from 'react-bootstrap';
import { inject, observer } from "mobx-react";

const mql = window.matchMedia(`(min-width: 1000px)`);

@inject("CreateTabStore")
@inject("globalStore")
@observer
class ItemsPreview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isWide: mql.matches, // if screen is wide enough modal will have some padding
            editArea: "",
            editAreaValue: ""
        }

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.editIcon = "fas fa-cog";
        this.store = this.props.CreateTabStore;
        this.globalStore = this.props.globalStore;
    }

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
    }

    componentWillUnmount() {
        mql.removeListener(this.mediaQueryChanged);
    }   

    mediaQueryChanged() {
        this.setState({isWide: mql.matches})
    } 

    _handleClick(e, val) {
        this.setState({editArea: e.target.innerHTML.toLowerCase(), editAreaValue: val})
    }

    handleChange(e) {
        this.setState({ editAreaValue: e.target.value });
    }

    _handleSubmit() {
        this.store.editItem("", `${this.props.itemInView.breadcrumb}.${this.state.editArea}`, this.state.editAreaValue);
        
        this.setState({editArea: "", editAreaValue: ""})
    }

    _handleCancel() {
        this.setState({editArea: "", editAreaValue: ""})
    }

    render() {
        var tempClassName = "item-preview-modal-cont-full";
        const editor = <div>
                        <FormControl
                            type="text"
                            value={this.state.editAreaValue}
                            placeholder="Enter text"
                            onChange={this.handleChange.bind(this)}
                        />
                        <Button onClick={this._handleSubmit.bind(this)}>Save</Button>
                        <Button onClick={this._handleCancel.bind(this)}>Cancel</Button>
                    </div>

        if(this.state.isWide) {
            tempClassName = "items-preview-modal-cont";
        }

        return(
        <Modal dialogClassName={tempClassName} show={this.props.show} onHide={() => this.props.handleClose()}>
        <Modal.Header closeButton>
            <Modal.Title >
            {
                this.props.itemInView.name
            }
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'#f8f8f8'}}>
            <Row>
                <Col xs={9} md={9}>
                    <Image style={{width: '100%', objectFit: 'cover'}} src={this.props.itemInView.uri}/>
                </Col>
                <Col xs={3} md={3} style={{color: "#5A626B"}}>
                    <a onClick={(e) => this._handleClick(e, this.props.itemInView.name)} className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Name
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <div style={{paddingTop:'4%'}}>
                        <Row>
                            <Col md={12}>
                                {
                                    this.state.editArea === "name"?
                                    (editor):
                                    (this.props.itemInView.name)
                                }
                            </Col>
                        </Row>
                    </div>
                    <hr/>

                    <a onClick={(e) => this._handleClick(e, this.props.itemInView.description)} className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Description
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <div style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                {
                                    this.state.editArea === "description"?
                                    (editor):
                                    (this.props.itemInView.description)
                                }
                            </Col>
                        </Row>
                    </div>
                    <hr/>

                    <a onClick={(e) => this._handleClick(e)} className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Price
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <div style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                $ {this.props.itemInView.price}
                            </Col>
                        </Row>
                    </div>
                    <hr/>

                    <a onClick={(e) => this._handleClick(e)} className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Image URL
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <div style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                <a style={{overflowWrap: 'break-word'}} href={this.props.itemInView.uri}>
                                    {this.props.itemInView.uri}
                                </a>
                            </Col>
                        </Row>
                    </div>
                    <hr/>

                    <a onClick={(e) => this._handleClick(e)} className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Menus
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <div style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                Some Menu - {this.props.itemInView.category}                                
                            </Col>
                        </Row>
                    </div>
                    <hr/>
                </Col>
            </Row>
            
        </Modal.Body>
        </Modal>
        )
    }

}

export default ItemsPreview;