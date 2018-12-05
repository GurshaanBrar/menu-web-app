import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';

var _ = require('lodash');

class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value:""
        }

        // debounce setup
        this.sendToParentBounced = _.debounce(this.sendToParent, 700);
    }

    sendToParent = () => {
        // only send value if it has text
        if (this.state.value !== " " ) {
            this.props.onChange(this.state.value)
        }
    }

    _handleChange = (e) => {
        this.setState({value:e.target.value})

        // send to parent when finished typing
        this.sendToParentBounced();
    }

    render() {
        return(
            <form onSubmit={e => e.preventDefault()}>
                <FormControl
                    style={{borderRadius:20}}
                    type="text"
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    onChange={this._handleChange}
                />
            </form>
        )
  }    
}

SearchBar.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default SearchBar;
