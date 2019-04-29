import React, { Component } from "react";
import { FormControl, Image, Col, Row, Button } from "react-bootstrap";

class ItemImageTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempUrl: ""
        };
    }

    handleChange(e) {
        this.setState({ tempUrl: e.target.value });
        this.props.handleChange(e);
    }

    render() {
        return (
            <div
                style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}
            >
                <h4>Cover Photo</h4>
                <p>
                    Put the url to an image of this item in the box below. This
                    will be what a customer see's on your menu's.
                </p>
                <div>
                    <FormControl
                        type="text"
                        placeholder="Enter URL here."
                        onChange={e => this.handleChange(e)}
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

class MenuCatTemplate extends Component {
    constructor(props) {
        super(props);

        let tempMenus = [];

        for (let m in this.props.tree) {
            tempMenus.push(m);
        }

        this.state = {
            tree: this.props.tree,
            menus: tempMenus,
            categories: [],
            menuSelected: "",
            categorySelected: ""
        };
    }

    handleMenuSelect(e) {
        let tempCategories = [];

        for (let m of this.props.tree[`${e.target.value}`]) {
            tempCategories.push(m);
        }
        this.setState({
            menuSelected: e.target.value,
            categories: tempCategories,
            categorySelected: ""
        });
    }

    handleCategorySelect(e) {
        this.props.handleChange(`${this.state.menuSelected}.${e.target.value}`)
        this.setState({ categorySelected: e.target.value });
    }

    render() {
        return (
            <div
                style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}
            >
                <Row className="show-grid" style={{ height: "40vh" }}>
                    <Col md={3}>
                        <h4>Menus</h4>
                        <br />
                        {this.state.menus.map((m, count) => {
                            if (m === this.state.menuSelected) {
                                return (
                                    <p key={`${m}${count}`}>
                                        <Button
                                            style={{
                                                backgroundColor: "grey",
                                                color: "white"
                                            }}
                                            value={m}
                                            onClick={e =>
                                                this.handleMenuSelect(e)
                                            }
                                        >
                                            {m}
                                        </Button>
                                    </p>
                                );
                            } else {
                                return (
                                    <p key={`${m}${count}`}>
                                        <Button
                                            value={m}
                                            onClick={e =>
                                                this.handleMenuSelect(e)
                                            }
                                        >
                                            {m}
                                        </Button>
                                    </p>
                                );
                            }
                        })}
                    </Col>
                    <Col
                        md={6}
                        style={{
                            marginLeft: "2%",
                            borderLeft: "solid",
                            borderWidth: "1px",
                            height: "100%"
                        }}
                    >
                        <h4>categories</h4>
                        <br />
                        {this.state.categories.length !== 0 ? (
                            <div>
                                {this.state.categories.map(c => {
                                    if (c === this.state.categorySelected) {
                                        return (
                                            <p>
                                                <Button
                                                    style={{
                                                        backgroundColor: "grey",
                                                        color: "white"
                                                    }}
                                                    value={c}
                                                    onClick={e =>
                                                        this.handleCategorySelect(
                                                            e
                                                        )
                                                    }
                                                >
                                                    {c}
                                                </Button>
                                            </p>
                                        );
                                    } else {
                                        return (
                                            <p>
                                                <Button
                                                    value={c}
                                                    onClick={e =>
                                                        this.handleCategorySelect(
                                                            e
                                                        )
                                                    }
                                                >
                                                    {c}
                                                </Button>
                                            </p>
                                        );
                                    }
                                })}
                            </div>
                        ) : (
                            <p>Choose a menu to see it's categories here.</p>
                        )}

                        {/* <div>
                            <FormControl
                                type="text"
                                placeholder="Enter URL here."
                                value={this.state.tempUrl}
                                onChange={e => this.handleChange(e)}
                            />
                        </div> */}
                    </Col>
                </Row>
            </div>
        );
    }
}

class DataTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            price: ""
        };
    }

    changeName(e) {
        this.setState({ name: e.target.value });
        this.props.handleChange(e, "name");
    }

    changeDescription(e) {
        this.setState({ description: e.target.value });
        this.props.handleChange(e, "description");
    }

    changePrice(e) {
        this.setState({ price: e.target.value });
        this.props.handleChange(e, "price");
    }

    render() {
        return (
            <div
                style={{ marginLeft: "7%", marginRight: "7%", marginTop: "1%" }}
            >
                <h4>Place Info</h4>
                <p>Enter the necessary info for your place.</p>
                <br />
                <br />
                <Row className="show-grid">
                    <Col xs={3} md={3}>
                        <p>Name: </p>
                    </Col>
                    <Col xs={9} md={9}>
                        <FormControl
                            type="text"
                            value={this.state.name}
                            placeholder="Enter name."
                            onChange={e => this.changeName(e)}
                        />
                    </Col>
                </Row>
                <br />
                <Row className="show-grid">
                    <Col xs={3} md={3}>
                        <p>Description: </p>
                    </Col>
                    <Col xs={9} md={9}>
                        <FormControl
                            type="text"
                            value={this.state.description}
                            placeholder="Enter description."
                            onChange={e => this.changeDescription(e)}
                        />
                    </Col>
                </Row>
                <br />
                <Row className="show-grid">
                    <Col xs={3} md={3}>
                        <p>Price: </p>
                    </Col>
                    <Col xs={9} md={9}>
                        <FormControl
                            type="text"
                            value={this.state.price}
                            placeholder="Enter price."
                            onChange={e => this.changePrice(e)}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export { ItemImageTemplate, MenuCatTemplate, DataTemplate };
