// External
import React, { Component } from 'react';
import { Modal, Image } from 'react-bootstrap';
import { Row, Col} from 'react-bootstrap';

const mql = window.matchMedia(`(min-width: 1000px)`);

class ItemsPreview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isWide: mql.matches // if screen is wide enough modal will have some padding
        }

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.editIcon = "fas fa-cog";
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


    render() {
        var tempClassName = "item-preview-modal-cont-full";

        if(this.state.isWide) {
            tempClassName = "items-preview-modal-cont";
        }

        console.log(tempClassName)

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
                    <a className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Name
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <p style={{paddingTop:'4%'}}>
                        <Row>
                            <Col md={12}>
                                {this.props.itemInView.name}
                            </Col>
                        </Row>
                    </p>
                    <hr/>

                    <a className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Description
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <p style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                %description%
                            </Col>
                        </Row>
                    </p>
                    <hr/>

                    <a className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Price
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <p style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                %price%
                            </Col>
                        </Row>
                    </p>
                    <hr/>

                    <a className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Image URL
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <p style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                %uri%
                            </Col>
                        </Row>
                    </p>
                    <hr/>

                    <a className="items-preview-custom-atag">
                        <Row>
                            <Col xs={9} md={10}>
                                Menus
                            </Col>
                            <Col xs={3} md={2}>
                                <i className={this.editIcon}/>
                            </Col>
                        </Row>
                    </a>
                    <p style={{paddingTop:'4%'}}>
                        <Row>           
                            <Col md={12}>
                                Breakfast Menu - Mains
                            </Col>
                        </Row>
                    </p>
                    <hr/>
                </Col>
            </Row>
            
        </Modal.Body>
        </Modal>
        )
    }

}

export default ItemsPreview;
