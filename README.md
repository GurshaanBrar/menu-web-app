# men-web-app

<Add description here>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

If you haven’t done so already, clone this repo onto your local machine.

```
git clone https://github.com/reactive-solutions/component-bucket.git
```

Navigate to the newly cloned repo and install dependencies

```
cd component-bucket && npm install
```

Also, be sure to create a new branch to add your changes to (NEVER COMMIT DIRECTLY TO MASTER!). Be sure to replace "[name_of_you_new_branch]" with the your new branches name.

```
git checkout -b [name_of_your_new_branch]
```

<add other installs ex firebase>
  
<Need env.js..>

### Running menu-web-app

This app uses storybook to help us develop components separately as a black box, run the storybook development server with the command...

```
npm start 
```

A tab should pop up in your default browser with the storybook app. On the left-hand side of your screen there should be a couple of "folders", you should currently be viewing the "Welcome" folder and "to Storybook" component. There is also an "Example" folder with some example components. Read [this doc](https://storybook.js.org/docs/basics/introduction/) learn more about how Storybook works.

## Contributing



### Coding Style

Be sure to leave as many comments as you can in any code you produce. Also be sure to follow the following class template below, again use the component 'ExampleForm' as refrence. Please include the following with your class file:
* a class header.
* for each function in the class a description, precondition, and postcondition.
* a propsType validator for each expected props (treat component as black box)

```
/*
 * Template.js
 *
 * Des:
 *    description of class and any useful info
 * 
 */
import React from "react";
import PropTypes from "prop-types";
// Import the css file (be sure it exists)
import "./Template.css";

export default class Template extends React.Component {
  constructor(props) {
    super(props);
    
    // Add states below, comment a description inline for each!
    this.state = {   
    };
  }
  
  // Des: function description
  // Pre: function pre conditions (what is the expected parameters)
  // Post: fuction post conditions (what changes after this function runs)
  someFunction() {
    //do something here
  }

  render() {
    // Add JSX elements in the return tag below
    return ();
  }
}

Template.propTypes = {
  // Add any props here with their expected type 
  // Example, myProp passed as a string
  // myProp: PropTypes.string // myProp handles x and does y ...
};
```



